import { PartnerData, PartnerViewData } from "@/lib/api/partners";

/**
 * Helper: translate multi-language field
 */
export const getLang = (
  field: any,
  locale: "en" | "ar"
) => {
  if (!field) return "";

  if (typeof field === "string") return field;

  return locale === "ar" ? field.ar || field.en : field.en || field.ar;
};


export function mapPartnerToDetailsView(
  partner: PartnerData,
  locale: "en" | "ar"
): PartnerViewData {
  return {
    _id: partner._id,

    name: getLang(partner.name, locale),
    slug: getLang(partner.slug, locale),

    partnership_type: partner.partnership_type,

    short_description: getLang(partner.short_description, locale),
    long_description: getLang(partner.long_description, locale),

    image: partner.image,

    social_links: partner.social_links,
   contact_info: {
  address: getLang(partner.contact_info?.address, locale),
  phone: partner.contact_info?.phone || "",
  email: partner.contact_info?.email || "",
},

    // ✅ FIXED: map services too
services: (partner.services || []).map((s) => ({      title: s.title,
      description: getLang(s.description, locale),
    })),
  };
}