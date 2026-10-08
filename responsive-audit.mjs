import { chromium } from "playwright";

const widths = [390, 768, 1024, 1280, 1440];
const base = "http://127.0.0.1:43123";

async function audit(page, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const header = await page.evaluate(() => {
    const headerEl = document.querySelector("header");
    const nav = headerEl?.querySelector("nav");
    const burger = headerEl?.querySelector('button[aria-label*="menu" i], button[aria-label*="Menu"], button[aria-label*="Otevřít"], button[aria-label*="Zavřít"]');
    const navVisible = !!(nav && getComputedStyle(nav).display !== "none");
    const burgerVisible = !!(burger && getComputedStyle(burger).display !== "none");
    return {
      height: Math.round(headerEl?.getBoundingClientRect().height || 0),
      navVisible,
      burgerVisible,
    };
  });

  await page.evaluate(() => document.querySelector("footer")?.scrollIntoView());
  await page.waitForTimeout(200);

  const footer = await page.evaluate(() => {
    const footerEl = document.querySelector("footer");
    const logo = footerEl?.querySelector('a[aria-label*="BLOOMS"]');
    const menuH = [...(footerEl?.querySelectorAll("p") || [])].find(
      (p) => p.textContent?.trim().toUpperCase() === "MENU",
    );
    if (!logo || !menuH) return { ok: false, reason: "missing nodes" };
    const a = logo.getBoundingClientRect();
    const b = menuH.getBoundingClientRect();
    const overlap = !(
      a.right <= b.left ||
      a.left >= b.right ||
      a.bottom <= b.top ||
      a.top >= b.bottom
    );
    return {
      ok: !overlap,
      overlap,
      logoBottom: Math.round(a.bottom),
      menuTop: Math.round(b.top),
      logoRight: Math.round(a.right),
      menuLeft: Math.round(b.left),
    };
  });

  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const clientW = document.documentElement.clientWidth;
    return { docW, clientW, overflow: docW > clientW + 2 };
  });

  // open hamburger if visible and screenshot menu
  let menuShot = null;
  if (header.burgerVisible) {
    await page.click('button[aria-label*="Otevřít"], button[aria-label*="menu" i]');
    await page.waitForTimeout(200);
    menuShot = `/workspace/responsive-menu-${width}.png`;
    await page.screenshot({ path: menuShot });
    // close
    await page.click('button[aria-label*="Zavřít"], button[aria-label*="menu" i]').catch(() => {});
  }

  const shot = `/workspace/responsive-${width}.png`;
  await page.goto(base + "/");
  await page.waitForTimeout(300);
  await page.screenshot({ path: shot });

  return { width, header, footer, overflow, shot, menuShot };
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const results = [];
for (const w of widths) {
  results.push(await audit(page, w));
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
