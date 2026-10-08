import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setViewportSize({ width: 390, height: 800 });
await page.goto("http://127.0.0.1:43123/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const offenders = await page.evaluate(() => {
  const clientW = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > clientW + 1 && r.width > 20) {
      out.push({
        tag: el.tagName,
        cls: (el.className?.toString?.() || "").slice(0, 100),
        right: Math.round(r.right),
        width: Math.round(r.width),
        left: Math.round(r.left),
      });
    }
  });
  out.sort((a, b) => b.right - a.right);
  return { clientW, scrollW: document.documentElement.scrollWidth, out: out.slice(0, 15) };
});
console.log(JSON.stringify(offenders, null, 2));
await browser.close();
