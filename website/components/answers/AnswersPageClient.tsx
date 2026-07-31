'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Footer } from '@/components/layout';
import { wallApi } from '@/lib/api/client';
import { AnswersHero } from './AnswersHero';
import { AnswersPaginationList } from './AnswersPaginationList';
import { QuestionHistory } from './QuestionHistory';
import {
  chunkAnswers,
  historyBucketFromPublishedAt,
  type AnswerItem,
  type WallHistoryListEntry,
} from './data';

const ANSWERS_PAGE_SIZE = 3;

const HISTORY_DATES = [
  '2025-11-01', '2025-10-25', '2025-10-18', '2025-10-11',
  '2025-10-04', '2025-09-27', '2025-09-20', '2025-09-13',
];

interface AnswersPageClientProps {
  locale: string;
}

export function AnswersPageClient({ locale }: AnswersPageClientProps) {
  const t = useTranslations('AnswersPage');
  const isRtl = locale === 'ar';

  const [pageIndex, setPageIndex] = useState(0);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const [currentWall, setCurrentWall] = useState<any>(null);
  const [historyWalls, setHistoryWalls] = useState<any[]>([]);
  const [selectedWall, setSelectedWall] = useState<any>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fallback mock answers (shown when API returns nothing)
  const fallbackAnswers: AnswerItem[] = useMemo(
    () => [
      { id: '1',  text: t('mockAnswer1')  },
      { id: '2',  text: t('mockAnswer2')  },
      { id: '3',  text: t('mockAnswer3')  },
      { id: '4',  text: t('mockAnswer4')  },
      { id: '5',  text: t('mockAnswer5')  },
      { id: '6',  text: t('mockAnswer6')  },
      { id: '7',  text: t('mockAnswer7')  },
      { id: '8',  text: t('mockAnswer8')  },
      { id: '9',  text: t('mockAnswer9')  },
      { id: '10', text: t('mockAnswer10') },
    ],
    [t],
  );

  // Fallback history (shown when API returns nothing)
  const fallbackHistory: WallHistoryListEntry[] = useMemo(
    () => [
      { id: 'h1', questionText: t('pastQ1'), responses: 247, publishedAt: HISTORY_DATES[0], bucket: 'older' },
      { id: 'h2', questionText: t('pastQ2'), responses: 183, publishedAt: HISTORY_DATES[1], bucket: 'older' },
      { id: 'h3', questionText: t('pastQ3'), responses: 312, publishedAt: HISTORY_DATES[2], bucket: 'older' },
      { id: 'h4', questionText: t('pastQ4'), responses: 156, publishedAt: HISTORY_DATES[3], bucket: 'older' },
      { id: 'h5', questionText: t('pastQ5'), responses: 289, publishedAt: HISTORY_DATES[4], bucket: 'older' },
      { id: 'h6', questionText: t('pastQ6'), responses: 198, publishedAt: HISTORY_DATES[5], bucket: 'older' },
      { id: 'h7', questionText: t('pastQ7'), responses: 264, publishedAt: HISTORY_DATES[6], bucket: 'older' },
      { id: 'h8', questionText: t('pastQ8'), responses: 175, publishedAt: HISTORY_DATES[7], bucket: 'older' },
    ],
    [t],
  );

  useEffect(() => {
    Promise.all([
      wallApi.getCurrent().catch(() => null) as Promise<any>,
      wallApi.getAll().catch(() => null) as Promise<any>,
    ]).then(([currentRaw, allRaw]) => {
      // Response: { success, data: { question: {id,text,...}, answers: [...] } }
      const questionData = currentRaw?.data?.question ?? null;
      const answersData: any[] = currentRaw?.data?.answers ?? [];
      const normalizedCurrent = questionData
        ? { id: questionData.id, question: questionData.text ?? '', answers: answersData, publishedAt: questionData.publishedAt ?? '' }
        : null;
      setCurrentWall(normalizedCurrent);

      // Response: { success, data: { items: [{id,text,status,...}], total, ... } }
      const allItems: any[] = allRaw?.data?.items ?? [];
      const past = allItems
        .filter((w: any) => w.id !== questionData?.id)
        .map((w: any) => ({
          id: w.id,
          question: w.text ?? '',
          responsesCount: w.featuredAnswerIds?.length ?? 0,
          publishedAt: w.publishedAt ?? w.createdAt ?? '',
          answers: [],
        }));
      setHistoryWalls(past);
    });
  }, []);

  // Fetch a specific past wall when selected
  useEffect(() => {
    if (!selectedHistoryId) { setSelectedWall(null); return; }
    setLoadingHistory(true);
    Promise.all([
      wallApi.getById(selectedHistoryId).catch(() => null),
      wallApi.getQuestionAnswers(selectedHistoryId).catch(() => null),
    ]).then(([wallRaw, answersRaw]: [any, any]) => {
      const questionData = wallRaw?.data?.question ?? wallRaw?.data ?? null;
      const questionText = questionData?.text ?? questionData?.question ?? '';
      const inlineAnswers: any[] = wallRaw?.data?.answers ?? [];
      const separateAnswers: any[] =
        answersRaw?.data?.items ?? (Array.isArray(answersRaw?.data) ? answersRaw.data : []);
      setSelectedWall({
        id: selectedHistoryId,
        question: questionText,
        answers: inlineAnswers.length > 0 ? inlineAnswers : separateAnswers,
      });
    }).finally(() => setLoadingHistory(false));
  }, [selectedHistoryId]);

  // Current question text
  const currentQuestionText = useMemo(() => {
    if (!currentWall) return null;
    return (isRtl ? (currentWall.questionAr ?? currentWall.question) : currentWall.question) ?? null;
  }, [currentWall, isRtl]);

  // Answers for the active view (current or history selection)
  const allAnswers: AnswerItem[] = useMemo(() => {
    const wall = selectedWall ?? currentWall;
    if (!wall) return fallbackAnswers;
    const raw: any[] = wall.answers ?? wall.wallCardAnswers ?? [];
    if (raw.length === 0) return fallbackAnswers;
    return raw.map((a: any) => ({
      id: String(a.id),
      text: (isRtl ? (a.textAr ?? a.text) : a.text) ?? '',
    }));
  }, [currentWall, selectedWall, isRtl, fallbackAnswers]);

  // History entries for the sidebar
  const historyEntries: WallHistoryListEntry[] = useMemo(() => {
    if (historyWalls.length === 0) return fallbackHistory;
    return historyWalls.map((w: any, i: number) => ({
      id: String(w.id),
      questionText: (isRtl ? (w.questionAr ?? w.question) : w.question) ?? t(`pastQ${i + 1}`) ?? '',
      responses: w.responsesCount ?? w.answers?.length ?? 0,
      publishedAt: w.publishedAt ?? w.createdAt ?? HISTORY_DATES[i] ?? '',
      bucket: historyBucketFromPublishedAt(w.publishedAt ?? w.createdAt ?? ''),
    }));
  }, [historyWalls, isRtl, t, fallbackHistory]);

  const currentPages = useMemo(() => chunkAnswers(allAnswers, ANSWERS_PAGE_SIZE), [allAnswers]);

  const selectedEntry = useMemo(
    () => historyEntries.find((h) => h.id === selectedHistoryId) ?? null,
    [historyEntries, selectedHistoryId],
  );

  const listAnswers = currentPages[pageIndex] ?? [];
  const listPageCount = Math.max(1, currentPages.length);

  const historyHero =
    selectedHistoryId && selectedEntry
      ? {
          weekLabel: historyEntries.indexOf(selectedEntry) + 1,
          questionText: selectedEntry.questionText,
          responses: selectedEntry.responses,
        }
      : null;

  function handleSelectHistory(id: string) {
    setSelectedHistoryId((prev) => (prev === id ? null : id));
    setPageIndex(0);
  }

  return (
    <main className="min-h-screen bg-black text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <AnswersHero
        locale={locale}
        currentQuestionText={currentQuestionText}
        historyQuestion={historyHero}
        onClearHistorySelection={() => {
          setSelectedHistoryId(null);
          setSelectedWall(null);
          setPageIndex(0);
        }}
      >
        {loadingHistory ? (
          <div className="flex justify-center py-10">
            <span className="animate-pulse text-secondary-200 font-helvetica">Loading...</span>
          </div>
        ) : (
          <AnswersPaginationList
            locale={locale}
            answers={listAnswers}
            pageIndex={pageIndex}
            pageCount={listPageCount}
            onPageIndexChange={setPageIndex}
          />
        )}
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
