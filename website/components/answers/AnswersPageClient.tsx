'use client';

import { useEffect, useMemo, useState } from 'react';
import { Footer } from '@/components/layout';
import { AnswersHero } from './AnswersHero';
import { AnswersPaginationList } from './AnswersPaginationList';
import { QuestionHistory } from './QuestionHistory';
import { ANSWER_PAGES, HISTORY_MOCK } from './data';

interface AnswersPageClientProps {
  locale: string;
}

export function AnswersPageClient({ locale }: AnswersPageClientProps) {
  const isRtl = locale === 'ar';

  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const selectedHistory = useMemo(
    () => HISTORY_MOCK.find((h) => h.id === selectedHistoryId) ?? null,
    [selectedHistoryId],
  );

  const answerPages = selectedHistory?.answerPages ?? ANSWER_PAGES;

  function handleSelectHistory(id: string) {
    setSelectedHistoryId((prev) => (prev === id ? null : id));
    setPageIndex(0);
  }

  useEffect(() => {
    if (!selectedHistoryId) return;
    const el = document.getElementById('weekly-answers');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedHistoryId]);

  return (
    <main className="min-h-screen bg-black text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <AnswersHero
        locale={locale}
        historyQuestion={
          selectedHistory
            ? {
                week: selectedHistory.week,
                questionKey: selectedHistory.questionKey,
                responses: selectedHistory.responses,
              }
            : null
        }
        onClearHistorySelection={() => {
          setSelectedHistoryId(null);
          setPageIndex(0);
        }}
      >
        <AnswersPaginationList
          locale={locale}
          answerPages={answerPages}
          pageIndex={pageIndex}
          onPageIndexChange={setPageIndex}
        />
      </AnswersHero>

      <QuestionHistory
        locale={locale}
        selectedHistoryId={selectedHistoryId}
        onSelectHistory={handleSelectHistory}
      />

      <Footer locale={locale} />
    </main>
  );
}
