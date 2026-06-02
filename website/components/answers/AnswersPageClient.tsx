'use client';

import { useEffect, useMemo, useState } from 'react';
import { getISOWeek } from 'date-fns';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout';
import {
  getCurrentWallCard,
  getWallCardHistoryAnswers,
  tryFetchWallCardHistoryQuestionList,
  type CurrentWallCardPayload,
  type WallCardQuestion,
} from '@/lib/api/wall-cards';
import { AnswersHero } from './AnswersHero';
import { AnswersPaginationList } from './AnswersPaginationList';
import { QuestionHistory } from './QuestionHistory';
import {
  chunkAnswers,
  historyBucketFromPublishedAt,
  type AnswerItem,
  type WallHistoryListEntry,
} from './data';

const ANSWERS_PAGE_SIZE = 4;

function mapToHistoryEntry(q: {
  id: string;
  text: string;
  publishedAt: string;
  responseCount?: number;
}): WallHistoryListEntry {
  return {
    id: q.id,
    questionText: q.text,
    responses: q.responseCount ?? 0,
    publishedAt: q.publishedAt,
    bucket: historyBucketFromPublishedAt(q.publishedAt),
  };
}

function mergeHistorySources(
  currentQuestionId: string,
  fromList: { id: string; text: string; publishedAt: string; responseCount?: number }[],
  fromPast: WallCardQuestion[],
): WallHistoryListEntry[] {
  const byId = new Map<string, WallHistoryListEntry>();
  for (const q of fromList) {
    byId.set(q.id, mapToHistoryEntry(q));
  }
  for (const q of fromPast) {
    const prev = byId.get(q.id);
    const rc = q.publicAnswerCount ?? q.responseCount ?? 0;
    byId.set(
      q.id,
      mapToHistoryEntry({
        id: q.id,
        text: q.text,
        publishedAt: q.publishedAt,
        responseCount: Math.max(rc, prev?.responses ?? 0),
      }),
    );
  }
  const merged = [...byId.values()].filter((e) => e.id !== currentQuestionId);
  merged.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return merged;
}

function visiblePublicAnswers(payload: CurrentWallCardPayload | null): AnswerItem[] {
  if (!payload) return [];
  return payload.answers
    .filter((a) => a.status === 'public' || a.status === 'approved')
    .map((a) => ({ id: a.id, text: a.text }));
}

interface AnswersPageClientProps {
  locale: string;
}

export function AnswersPageClient({ locale }: AnswersPageClientProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';

  const [current, setCurrent] = useState<CurrentWallCardPayload | null>(null);
  const [currentError, setCurrentError] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<WallHistoryListEntry[]>([]);

  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const [historyAnswers, setHistoryAnswers] = useState<AnswerItem[]>([]);
  const [historyMeta, setHistoryMeta] = useState<{ totalPages: number } | null>(null);
  const [historyAnswersLoading, setHistoryAnswersLoading] = useState(false);
  const [historyAnswersError, setHistoryAnswersError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setCurrentError(false);
      try {
        const [payload, listExtra] = await Promise.all([
          getCurrentWallCard(),
          tryFetchWallCardHistoryQuestionList(),
        ]);
        if (cancelled) return;
        setCurrent(payload);
        const merged = mergeHistorySources(
          payload.question.id,
          listExtra,
          payload.pastQuestions ?? [],
        );
        setHistoryEntries(merged);
      } catch {
        if (!cancelled) {
          setCurrentError(true);
          setCurrent(null);
          setHistoryEntries([]);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedHistoryId) return;

    let cancelled = false;

    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setHistoryAnswersLoading(true);
      setHistoryAnswersError(false);
      try {
        const data = await getWallCardHistoryAnswers(selectedHistoryId, {
          page: pageIndex + 1,
          limit: ANSWERS_PAGE_SIZE,
        });
        if (cancelled) return;
        const totalPages = Math.max(1, data.totalPages || 1);
        setHistoryMeta({ totalPages });
        const items = (data.items ?? [])
          .filter((a) => a.status === 'public' || a.status === 'approved')
          .map((a) => ({ id: a.id, text: a.text }));
        setHistoryAnswers(items);
      } catch {
        if (!cancelled) {
          setHistoryAnswersError(true);
          setHistoryAnswers([]);
          setHistoryMeta(null);
        }
      } finally {
        if (!cancelled) setHistoryAnswersLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedHistoryId, pageIndex]);

  const selectedEntry = useMemo(
    () => historyEntries.find((h) => h.id === selectedHistoryId) ?? null,
    [historyEntries, selectedHistoryId],
  );

  const currentAnswerItems = useMemo(() => visiblePublicAnswers(current), [current]);
  const currentPages = useMemo(
    () => chunkAnswers(currentAnswerItems, ANSWERS_PAGE_SIZE),
    [currentAnswerItems],
  );

  const listAnswers = selectedHistoryId ? historyAnswers : (currentPages[pageIndex] ?? []);
  const listPageCount = selectedHistoryId
    ? (historyMeta?.totalPages ?? 1)
    : Math.max(1, currentPages.length);
  const listLoading = Boolean(selectedHistoryId) && historyAnswersLoading;

  function handleSelectHistory(id: string) {
    setSelectedHistoryId((prev) => (prev === id ? null : id));
    setPageIndex(0);
  }

  useEffect(() => {
    if (!selectedHistoryId) return;
    const el = document.getElementById('weekly-answers');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedHistoryId]);

  const historyHero =
    selectedHistoryId && selectedEntry
      ? {
          weekLabel: Number.isNaN(new Date(selectedEntry.publishedAt).getTime())
            ? 0
            : getISOWeek(new Date(selectedEntry.publishedAt)),
          questionText: selectedEntry.questionText,
          responses: selectedEntry.responses,
        }
      : null;

  return (
    <main className="min-h-screen bg-black text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <AnswersHero
        locale={locale}
        currentQuestionText={selectedHistoryId ? null : (current?.question.text ?? null)}
        historyQuestion={historyHero}
        onClearHistorySelection={() => {
          setSelectedHistoryId(null);
          setPageIndex(0);
        }}
      >
        {((currentError && !selectedHistoryId) || (historyAnswersError && selectedHistoryId)) && (
          <p
            className={`mb-6 text-primary text-sm max-w-[480px] ${isRtl ? 'font-arabic text-right' : 'font-helvetica'}`}
          >
            {t('loadError')}
          </p>
        )}
        <AnswersPaginationList
          locale={locale}
          answers={listAnswers}
          pageIndex={pageIndex}
          pageCount={listPageCount}
          onPageIndexChange={setPageIndex}
          isLoading={listLoading}
        />
      </AnswersHero>

      <QuestionHistory
        locale={locale}
        entries={historyEntries}
        selectedHistoryId={selectedHistoryId}
        onSelectHistory={handleSelectHistory}
      />

      <Footer locale={locale} />
    </main>
  );
}
