import { CrudService } from "./generic-api-service";

export enum CardSizeEnum {
  SMALL = "small",
  MEDIUM = "med",
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
  contact_info: {
    address: {
      en: string;
      ar: string;
    };
    phone: string;
    email: string;
  };

  services: {
    title: string;
    description: {
      en: string;
      ar: string;
    };
  }[];
}

export const partnersApi = new CrudService<PartnerData>("/partners", false);

export const partnersAdminApi = new CrudService<PartnerData>("/partners", true);
