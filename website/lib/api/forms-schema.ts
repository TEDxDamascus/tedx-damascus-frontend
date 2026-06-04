import type { ApiFormData, ApiFormResponse, FormSubmitResponse } from '@/types/form-schema';

const FORMS_API_BASE = 'https://api.tedxdamascus.sy';

export type FormSchemaResult =
  | { ok: true; schema: ApiFormData }
  | { ok: false; reason: 'not_found' | 'network_error' };

export async function getFormSchema(slug: string): Promise<FormSchemaResult> {
  try {
    const res = await fetch(`${FORMS_API_BASE}/forms/${slug}/schema`, {
      cache: 'no-store',
    });
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: 'network_error' };
    const body = await res.json().catch(() => null) as ApiFormResponse | null;
    if (!body?.success || !body?.data) return { ok: false, reason: 'not_found' };
    return { ok: true, schema: body.data };
  } catch {
    return { ok: false, reason: 'network_error' };
  }
}

export async function getFormBySlug(slug: string): Promise<FormSchemaResult> {
  try {
    const res = await fetch(
      `${FORMS_API_BASE}/forms/by-slug?slug=${encodeURIComponent(slug)}`,
      { cache: 'no-store' },
    );
    if (res.status === 404) return { ok: false, reason: 'not_found' };
    if (!res.ok) return { ok: false, reason: 'network_error' };
    const body = await res.json().catch(() => null) as ApiFormResponse | null;
    if (!body?.success || !body?.data) return { ok: false, reason: 'not_found' };
    return { ok: true, schema: body.data };
  } catch {
    return { ok: false, reason: 'network_error' };
  }
}

export async function getAllFormSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${FORMS_API_BASE}/forms`, { cache: 'no-store' });
    if (!res.ok) return [];
    const body = await res.json().catch(() => null) as
      | { success?: boolean; data?: { id: string }[] }
      | { id: string }[]
      | null;
    if (!body) return [];
    const forms = Array.isArray(body)
      ? body
      : ((body as { data?: { id: string }[] }).data ?? []);
    return forms.map((f) => f.id);
  } catch {
    return [];
  }
}

export async function submitFormData(
  slug: string,
  data: Record<string, unknown>,
): Promise<FormSubmitResponse> {
  try {
    const res = await fetch(`${FORMS_API_BASE}/forms/${slug}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { message?: string };
      return { success: false, message: err.message || 'Submission failed' };
    }
    const body = await res.json().catch(() => ({})) as { id?: string };
    return { success: true, id: body.id };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}
