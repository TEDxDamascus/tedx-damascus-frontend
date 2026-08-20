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

// GET /organizer/:id requires a logged-in session (see ApiClient's auth
// interceptor in generic-api-service.ts). Only call this once a token is
// known to exist — see hasAuthToken() below — otherwise a 401 triggers a
// hard redirect to /login for every anonymous visitor.
export const organizersAdminApi = new CrudService<OrganizerData>(
  "/organizer",
  true,
);

export function hasAuthToken(): boolean {
  return typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
}

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

export async function getOrganizerById(
  id: string,
  lang?: string,
): Promise<OrganizerData | null> {
  const organizers = await getAllOrganizers(lang);
  return organizers.find((organizer) => organizer._id === id) || null;
}

// Calls GET /organizer/:id directly instead of filtering the public list.
// Throws on failure (including 401 when not logged in) so callers can react.
export async function getOrganizerByIdAuth(id: string): Promise<OrganizerData> {
  return organizersAdminApi.getById(id);
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
