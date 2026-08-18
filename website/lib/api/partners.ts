import { CrudService } from "./generic-api-service";

export enum CardSizeEnum {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export interface MultiLangField {
  en: string;
  ar: string;
}

export interface PartnerData {
  _id: string;

  name: MultiLangField;
  slug: MultiLangField;
  partner_ship_type: string;

  tier?: {
    type?: string;
    name?: string;
    size?: CardSizeEnum;
    custom_card_size?: CardSizeEnum;
  };

  custom_card_size?: CardSizeEnum;
  year?: number;
  short_description: MultiLangField;
  long_description: MultiLangField;
  social_links: string[];
  contact_info: {
    address: MultiLangField;
    phone: string;
    email: string;
  };

  services: {
    title: string;
    description: MultiLangField;
  }[];

  image: string;
}

export interface PartnerViewData {
  _id: string;

  name: string;
  slug: string;

  partner_ship_type: string;

  custom_card_size?: CardSizeEnum;

  year?: number;

  short_description: string;
  long_description: string;

  social_links: string[];

  image: string;

  tier?: {
    type?: string;
    name?: string;
    size?: CardSizeEnum;
    custom_card_size?: CardSizeEnum;
  };

  contact_info: {
    address: string;
    phone: string;
    email: string;
  };

  services: {
    title: string;
    description: string;
  }[];
}
const FIXED_TIER_ALIASES: Record<string, string> = {
  platinum: "diamond",
  golden: "gold",
};

const FIXED_TIER_KEYS = ["diamond", "gold", "silver"];

export function normalizeTier(rawType?: string | null): string {
  const key = rawType?.trim().toLowerCase() || "other";
  return FIXED_TIER_ALIASES[key] || key;
}

export function isFixedTier(rawType?: string | null): boolean {
  return FIXED_TIER_KEYS.includes(normalizeTier(rawType));
}

const TIER_TO_BACKEND: Record<string, string> = {
  diamond: "Platinum",
  gold: "Gold",
  silver: "Silver",
};

export function denormalizeTier(uiTier: string): string {
  const key = uiTier?.trim().toLowerCase() || "other";
  return TIER_TO_BACKEND[key] || uiTier;
}

export const partnersApi = new CrudService<PartnerData>("/partners", false);

export const partnersAdminApi = new CrudService<PartnerData>("/partners", true);
