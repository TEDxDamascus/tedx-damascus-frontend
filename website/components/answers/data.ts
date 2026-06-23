export type TimeFilter = 'all' | '30d' | '90d';

export type HistoryTimeBucket = '30d' | '90d' | 'older';

/** One answer row shown in the paginated list (API text). */
export type AnswerItem = { id: string; text: string };

export type WallHistoryListEntry = {
  id: string;
  questionText: string;
  responses: number;
  publishedAt: string;
  bucket: HistoryTimeBucket;
};

export function historyBucketFromPublishedAt(iso: string): HistoryTimeBucket {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 'older';
  const days = (Date.now() - t) / 86400000;
  if (days <= 30) return '30d';
  if (days <= 90) return '90d';
  return 'older';
}

export function chunkAnswers<T>(items: T[], pageSize: number): T[][] {
  if (items.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}
