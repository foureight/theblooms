import { getCmsContent, mergeSiteContact } from "@/lib/cms/content";
import { SiteFooterView } from "@/components/site-footer-view";

export async function SiteFooter() {
  const cms = await getCmsContent();
  const contact = mergeSiteContact(cms);
  return <SiteFooterView contact={contact} />;
}
