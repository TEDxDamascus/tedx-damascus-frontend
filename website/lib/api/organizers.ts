import { CrudService } from "./generic-api-service";

export interface MultiLangField {
  en?: string;
  ar?: string;
}

export interface OrganizerData {
  _id: string;
  name: MultiLangField | string;
  image?: { url: string } | string;
  bio?: MultiLangField | string;
  social_links?: string[];
  role?: string;
  gallery?: Array<{ url: string } | string>;
}

export interface OrganizerViewData {
  _id: string;
  name: string;
  image: string;
  bio?: string;
  social_links?: string[];
  role?: string;
  gallery?: string[];
}

export const organizersApi = new CrudService<OrganizerData>(
  "/organizer",
  false,
);

export async function getAllOrganizers(): Promise<OrganizerData[]> {
  try {
    const res = await organizersApi.getAll();
    return Array.isArray(res) ? res : res?.data || [];
  } catch (error) {
    console.error("Failed to fetch organizers:", error);
    return [];
  }
}

export async function getOrganizerById(
  id: string,
): Promise<OrganizerData | null> {
  try {
    const res = await organizersApi.getById(id);
    return res || null;
  } catch (error) {
    console.error(`Failed to fetch organizer ${id}:`, error);
    return null;
  }
}
