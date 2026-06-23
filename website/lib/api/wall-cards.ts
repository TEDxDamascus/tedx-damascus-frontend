import type { ApiError } from '@/lib/api/generic-api-service';

/** Answer row returned after submitting to the current wall card question. */
export interface WallAnswerData {
  id: string;
  questionId: string;
  text: string;
  status: string;
  submittedAt: string;
  createdAt: string;
}

export interface SubmitWallAnswerResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: WallAnswerData;
}

export interface WallCardQuestion {
  id: string;
  text: string;
  expiresAt: string;
  tags: string[];
  status: string;
  publishedAt: string;
  publishedBy?: string;
  featuredAnswerIds?: string[];
  createdAt: string;
  updatedAt: string;
  /** If the API includes counts on list payloads */
  responseCount?: number;
  publicAnswerCount?: number;
}

export interface WallCardPublicAnswer {
  id: string;
  questionId: string;
  text: string;
  status: string;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
}

/** GET /wall-cards/current — optional pastQuestions when the API embeds an archive list */
export interface CurrentWallCardPayload {
  question: WallCardQuestion;
  answers: WallCardPublicAnswer[];
  pastQuestions?: WallCardQuestion[];
}

export interface CurrentWallCardResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: CurrentWallCardPayload;
}

export interface HistoryAnswersPayload {
  items: WallCardPublicAnswer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HistoryAnswersResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: HistoryAnswersPayload;
}

type ErrorBody = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
  details?: string;
};

function throwIfWallCardFailed(res: Response, body: ErrorBody & { data?: unknown }): void {
  const failed = !res.ok || body.success === false;
  if (failed) {
    const err: ApiError = {
      message: body.message || body.details || 'An error occurred',
      statusCode: body.statusCode ?? res.status,
      error: body.error,
    };
    throw err;
  }
}

/**
 * POST /wall-cards/current/answers — browser calls same-origin `/api/...` so next.config rewrites
 * to `NEXT_PUBLIC_API_URL` without CORS issues.
 */
export async function submitCurrentWallAnswer(text: string): Promise<SubmitWallAnswerResponse> {
  const res = await fetch('/api/wall-cards/current/answers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  let body: SubmitWallAnswerResponse & ErrorBody;
  try {
    body = (await res.json()) as SubmitWallAnswerResponse & ErrorBody;
  } catch {
    const err: ApiError = {
      message: 'An error occurred',
      statusCode: res.status,
    };
    throw err;
  }

  const failed = !res.ok || body.success === false;
  if (failed) {
    const err: ApiError = {
      message: body.message || body.details || 'An error occurred',
      statusCode: body.statusCode ?? res.status,
      error: body.error,
    };
    throw err;
  }

  return body;
}

/** GET /wall-cards/current */
export async function getCurrentWallCard(): Promise<CurrentWallCardPayload> {
  const res = await fetch('/api/wall-cards/current', { method: 'GET' });
  let body: CurrentWallCardResponse & ErrorBody;
  try {
    body = (await res.json()) as CurrentWallCardResponse & ErrorBody;
  } catch {
    const err: ApiError = { message: 'An error occurred', statusCode: res.status };
    throw err;
  }
  throwIfWallCardFailed(res, body);
  if (!body.data) {
    const err: ApiError = { message: 'Invalid response', statusCode: res.status };
    throw err;
  }
  return body.data;
}

/**
 * Answers referenced by `question.featuredAnswerIds`, in that order.
 * Skips ids not present in `answers`. Use with `GET /wall-cards/current` payload.
 */
export function getFeaturedWallAnswers(
  question: WallCardQuestion,
  answers: WallCardPublicAnswer[],
): WallCardPublicAnswer[] {
  const ids = question.featuredAnswerIds ?? [];
  if (ids.length === 0) return [];
  const byId = new Map(answers.map((a) => [a.id, a]));
  const out: WallCardPublicAnswer[] = [];
  for (const id of ids) {
    const row = byId.get(id);
    if (row) out.push(row);
  }
  return out;
}

/** GET /wall-cards/history/:questionId/answers */
export async function getWallCardHistoryAnswers(
  questionId: string,
  params: { page: number; limit: number },
): Promise<HistoryAnswersPayload> {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  const path = `history/${encodeURIComponent(questionId)}/answers?${search.toString()}`;
  const res = await fetch(`/api/wall-cards/${path}`, { method: 'GET' });
  let body: HistoryAnswersResponse & ErrorBody;
  try {
    body = (await res.json()) as HistoryAnswersResponse & ErrorBody;
  } catch {
    const err: ApiError = { message: 'An error occurred', statusCode: res.status };
    throw err;
  }
  throwIfWallCardFailed(res, body);
  if (!body.data) {
    const err: ApiError = { message: 'Invalid response', statusCode: res.status };
    throw err;
  }
  return body.data;
}

export type WallHistoryQuestionListItem = {
  id: string;
  text: string;
  publishedAt: string;
  responseCount?: number;
};

/**
 * Optional GET /wall-cards/history — some backends expose an index of past questions here.
 * Returns [] on network error, non-OK response, or unrecognized JSON (no thrown error).
 */
export async function tryFetchWallCardHistoryQuestionList(): Promise<WallHistoryQuestionListItem[]> {
  try {
    const res = await fetch('/api/wall-cards/history', { method: 'GET' });
    if (!res.ok) return [];
    const body = (await res.json()) as {
      success?: boolean;
      data?: unknown;
    };
    const d = body.data;
    let raw: unknown[] = [];
    if (Array.isArray(d)) {
      raw = d;
    } else if (d && typeof d === 'object') {
      const o = d as Record<string, unknown>;
      if (Array.isArray(o.items)) raw = o.items;
      else if (Array.isArray(o.questions)) raw = o.questions;
    }
    const out: WallHistoryQuestionListItem[] = [];
    for (const x of raw) {
      if (!x || typeof x !== 'object') continue;
      const o = x as Record<string, unknown>;
      if (typeof o.id !== 'string' || typeof o.text !== 'string') continue;
      const publishedAt =
        typeof o.publishedAt === 'string' ? o.publishedAt : new Date().toISOString();
      const responseCount =
        typeof o.responseCount === 'number'
          ? o.responseCount
          : typeof o.total === 'number'
            ? o.total
            : typeof o.publicAnswerCount === 'number'
              ? o.publicAnswerCount
              : undefined;
      out.push({ id: o.id, text: o.text, publishedAt, responseCount });
    }
    return out;
  } catch {
    return [];
  }
}
