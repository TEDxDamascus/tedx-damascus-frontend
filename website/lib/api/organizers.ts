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

export async function getAllOrganizers(
  lang?: string,
): Promise<OrganizerData[]> {
  try {
    const res = await organizersApi.getAll(lang ? { lang } : undefined);
    return Array.isArray(res) ? res : res?.data || [];
  } catch (error) {
    console.error("Failed to fetch organizers:", error);
    return [];
  }
}

// GET /organizer/:id is public now, so fetch the record directly the same
// way events/partners do — falling back to the public list only if the
// direct call fails (e.g. a transient 503 right after an admin deletes then
// restores the organizer, before the retry in generic-api-service.ts kicks
// in, or the record's `_id` genuinely doesn't exist).
export async function getOrganizerById(
  id: string,
  lang?: string,
): Promise<OrganizerData | null> {
  try {
    const res = await organizersApi.getById(id);
    const organizer = (res as any)?.data ?? res;
    if (organizer && organizer._id) {
      return organizer;
    }
  } catch (error) {
    console.error(`Failed to fetch organizer ${id} directly, falling back to list:`, error);
  }

  const organizers = await getAllOrganizers(lang);
  return organizers.find((organizer) => organizer._id === id) || null;
}

export function formatOrganizer(
  organizer: OrganizerData,
  locale: "en" | "ar",
): OrganizerViewData {
  const nameString =
    typeof organizer.name === "object"
      ? organizer.name[locale] || organizer.name.en || ""
      : organizer.name;

  const bioString =
    typeof organizer.bio === "object"
      ? organizer.bio?.[locale] || organizer.bio?.en || ""
      : organizer.bio || "";

  const imageUrl =
    typeof organizer.image === "object"
      ? organizer.image.url
      : organizer.image || "";

  const galleryUrls: string[] = (organizer.gallery || [])
    .map((item) => (typeof item === "object" && item !== null ? item.url : item))
    .filter((url): url is string => Boolean(url));

  return {
    _id: organizer._id,
    name: nameString,
    image: imageUrl,
    bio: bioString,
    social_links: organizer.social_links || [],
    role: organizer.role || "",
    gallery: galleryUrls,
  };
}
