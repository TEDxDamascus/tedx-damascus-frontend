'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getISOWeek } from 'date-fns';
import { Navbar, Footer } from '@/components/layout';
import { wallApi } from '@/lib/api/client';

const PATTERN_SRC = '/images/about/pattern.svg';
const COMMENTS_SRC = '/images/add-your-line/Comments.svg';
const ANSWERS_BATCH = 12;
const ANSWERS_VIEW = 3;
const H_PER_PAGE = 4;

interface ARow { id: string; text: string }
interface QRow {
  id: string;
  q: string;
  qAr: string;
  week: number | null;
  count: number;
}

function normalizeQuestions(raw: any[]): QRow[] {
  return raw.map((q: any) => {
    const d = new Date(q.publishedAt ?? q.createdAt ?? '');
    return {
      id: String(q.id),
      q: q.text ?? q.question ?? q.questionEn ?? '',
      qAr: q.textAr ?? q.questionAr ?? q.text ?? '',
      week: q.weekNumber ?? (!Number.isNaN(d.getTime()) ? getISOWeek(d) : null),
      count: q.responsesCount ?? q.answersCount ?? (q.featuredAnswerIds?.length ?? 0),
    };
  });
}

function getCachedQuestion(id: string): any | null {
  try {
    const raw = localStorage.getItem(`tedx_question_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface QuestionDetailClientProps {
  locale: string;
  questionId: string;
}

export function QuestionDetailClient({ locale, questionId }: QuestionDetailClientProps) {
  const isRtl = locale === 'ar';

  const [question, setQuestion] = useState<any>(null);

  const [answers, setAnswers]   = useState<ARow[]>([]);
  const [viewIdx, setViewIdx]   = useState(0);
  const [aBatch, setABatch]     = useState(1);
  const [totalA, setTotalA]     = useState(0);
  const [loadA, setLoadA]       = useState(false);

  const [history, setHistory]   = useState<QRow[]>([]);
  const [hPage, setHPage]       = useState(0); // 0 = not yet triggered
  const [hTotalP, setHTotalP]   = useState(1);
  const [loadH, setLoadH]       = useState(false);
  const historyRef              = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = getCachedQuestion(questionId);
    if (cached) setQuestion(cached);
  }, [questionId]);

  useEffect(() => {
    setLoadA(true);
    wallApi
      .getQuestionAnswers(questionId, { page: aBatch, limit: ANSWERS_BATCH })
      .then((res: any) => {
        // Question is embedded in the answers response — extract it on first load
        if (aBatch === 1) {
          const qData = res?.data?.question;
          if (qData) {
            setQuestion(qData);
            try { localStorage.setItem(`tedx_question_${questionId}`, JSON.stringify(qData)); } catch {}
          }
        }
        const raw: any[] = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : res?.answers ?? (Array.isArray(res) ? res : []));
        const publicRaw = raw.filter((a: any) => !a.status || a.status === 'public');
        const rows: ARow[] = publicRaw.map((a: any) => ({
          id: String(a.id),
          text: (isRtl ? (a.textAr ?? a.text) : a.text) ?? '',
        }));
        setAnswers((p) => (aBatch === 1 ? rows : [...p, ...rows]));
        setTotalA(res?.data?.total ?? res?.total ?? res?.totalCount ?? raw.length);
        if (aBatch > 1) setViewIdx(0);
      })
      .catch(() => {})
      .finally(() => setLoadA(false));
  }, [questionId, aBatch, isRtl]);

  // Trigger history load when section scrolls into view (lazy — not on mount)
  useEffect(() => {
    const el = historyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHPage((p) => p === 0 ? 1 : p); },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fetch history page only when hPage > 0
  useEffect(() => {
    if (hPage === 0) return;
    setLoadH(true);
    wallApi
      .getQuestions({ page: hPage, limit: H_PER_PAGE })
      .then((res: any) => {
        const raw: any[] = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        raw.forEach((q: any) => {
          if (q.id) {
            try { localStorage.setItem(`tedx_question_${q.id}`, JSON.stringify(q)); } catch {}
          }
        });
        setHistory(normalizeQuestions(raw).filter((q) => q.id !== questionId));
        const tot = res?.data?.total ?? res?.total ?? raw.length;
        setHTotalP(res?.data?.totalPages ?? res?.totalPages ?? Math.max(1, Math.ceil(tot / H_PER_PAGE)));
      })
      .catch(() => {})
      .finally(() => setLoadH(false));
  }, [hPage, questionId]);

  // Answer chunks + pagination
  const chunks: ARow[][] = [];
  for (let i = 0; i < answers.length; i += ANSWERS_VIEW)
    chunks.push(answers.slice(i, i + ANSWERS_VIEW));

  const totalApiP = Math.max(1, Math.ceil(totalA / ANSWERS_BATCH));
  const hasPrev   = viewIdx > 0;
  const hasNext   = viewIdx < chunks.length - 1 || aBatch < totalApiP;
  const aDots     = Math.min(4, Math.max(1, chunks.length));
  const shown     = chunks[viewIdx] ?? [];

  function nextA() {
    if (viewIdx < chunks.length - 1) { setViewIdx((p) => p + 1); return; }
    if (aBatch < totalApiP) { setABatch((p) => p + 1); }
  }
  function prevA() {
    if (viewIdx > 0) setViewIdx((p) => p - 1);
  }

  const questionText = question
    ? (isRtl
        ? (question.textAr ?? question.text ?? question.questionAr ?? question.question)
        : (question.text ?? question.question)
      ) ?? null
    : null;

  const hDots = Math.min(4, Math.max(1, hTotalP));

  return (
    <main className="min-h-screen bg-[#101010] text-white" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-[#101010] overflow-hidden">

        {/* Pattern graphic — absolute, decorative at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PATTERN_SRC}
            alt=""
            className={['block h-[320px] w-full object-cover object-top select-none', isRtl ? 'scale-x-[-1]' : ''].join(' ')}
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#101010] to-transparent" />
        </div>

        {/* Left-to-right gradient overlay */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#101010]/95 via-[#101010]/70 to-transparent" aria-hidden />

        {/* Navbar is absolute (zero flow height) — z-50 keeps it clickable above everything */}
        <div className="relative z-50">
          <Navbar locale={locale} />
        </div>

        {/* In-flow spacer: exactly the graphic height so content starts below it */}
        <div className="h-[320px] pointer-events-none" aria-hidden />

        {/* Content — starts at y≈320px, below the graphic */}
        <div className="relative z-20 w-full px-6 sm:px-12 lg:px-[80px] pb-24">
          <div className="mx-auto max-w-[1280px] w-full">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">

            {/* LEFT: Question */}
            <div className="lg:col-span-6 py-[18px] mb-12 lg:mb-0">
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-[12px] font-semibold text-primary tracking-[2.4px] uppercase font-helvetica">
                  {isRtl ? 'سؤال الأسبوع' : 'OUR WEEKLY QUESTION'}
                </p>
                <h1
                  className={[
                    'text-white font-light text-4xl sm:text-5xl lg:text-[60px] leading-[1.2] tracking-[-0.5px]',
                    isRtl ? 'font-arabic text-right' : 'font-helvetica',
                  ].join(' ')}
                >
                  {questionText || (isRtl
                    ? 'ما هي الفكرة التي تنبع من دمشق...'
                    : 'What idea rising from Damascus should reach the world?')}
                </h1>
              </div>

              <p
                className={[
                  'text-white text-base leading-6 tracking-[0.15px] max-w-[512px]',
                  isRtl ? 'font-arabic text-right' : 'font-helvetica',
                ].join(' ')}
              >
                {isRtl
                  ? 'كل أسبوع نستكشف التقاطع بين الحكمة القديمة والابتكار الحديث. شاركنا برأيك وانضم إلى الحوار.'
                  : 'Every week, we explore the intersection of ancient wisdom and modern innovation. Share your perspective and join the conversation.'}
              </p>
            </div>

            {/* RIGHT: Answer cards + pagination always at bottom */}
            <div className="lg:col-span-5 lg:col-start-8 flex flex-col lg:min-h-[680px]">

              {/* Cards area — flex-1 so it fills the column, pagination pushed to bottom */}
              <div className="flex-1">
                {loadA && shown.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <span className="animate-pulse text-white/40 text-sm font-helvetica">Loading…</span>
                  </div>
                ) : shown.length === 0 ? (
                  <div className="flex items-center justify-center py-16">
                    <p className="text-white/30 text-sm font-helvetica">
                      {isRtl ? 'لا توجد إجابات بعد' : 'No answers yet'}
                    </p>
                  </div>
                ) : (
                  shown.map((a, i) => (
                    <div
                      key={a.id}
                      className={['relative border-b border-white/5 px-10 pb-10 pt-10 min-h-[160px]', i > 0 ? 'mt-6' : ''].join(' ')}
                    >
                      <span
                        className="absolute top-[54px] left-6 -translate-y-1/2 text-[60px] leading-[60px] text-primary opacity-20 font-serif select-none pointer-events-none"
                        aria-hidden
                      >&ldquo;</span>
                      <div className="border-l-2 border-primary pl-[18px]">
                        <p className="text-white/90 text-base leading-[1.8] font-helvetica">{a.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination — always rendered, static position at bottom via mt-auto */}
              <div className="mt-auto pt-6 flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={prevA}
                  disabled={!hasPrev}
                  aria-label="Previous"
                  className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/20 disabled:opacity-40 hover:bg-white/10 transition-colors shrink-0"
                >
                  <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d={isRtl ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: Math.max(1, aDots) }).map((_, di) => (
                    <div
                      key={di}
                      className={['size-[6px] rounded-full transition-colors', di === viewIdx % Math.max(1, aDots) ? 'bg-primary' : 'bg-[#E5E2E1]/30'].join(' ')}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={nextA}
                  disabled={!hasNext}
                  aria-label="Next"
                  className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/20 disabled:opacity-40 hover:bg-white/10 transition-colors shrink-0"
                >
                  <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
                      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

            </div>

          </div>
          </div>
        </div>
      </section>

      {/* Sentinel: triggers lazy history load when scrolled into view — always rendered */}
      <div ref={historyRef} />

      {/* ── Question History — always shown; grey text when empty ───────── */}
      <section
        className="bg-[#101010] border-t border-white/5 px-6 sm:px-12 lg:px-[80px] pt-[65px] pb-[64px]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-[1280px] flex flex-col gap-12">

          <div className="flex flex-col gap-4">
            <p className="text-primary text-[12px] font-semibold tracking-[3.6px] uppercase font-helvetica">
              {isRtl ? 'أسئلة سابقة' : 'QUESTION HISTORY'}
            </p>
            <div className="w-24 h-px bg-primary" />
          </div>

          <div className="border-b border-white/10 pb-[17px]">
            <button
              type="button"
              className="flex items-center gap-2 border border-white/20 px-[25px] py-[9px] hover:border-white/40 transition-colors"
            >
              <span className="text-[#E5E2E1] text-[12px] font-semibold tracking-[0.6px] uppercase font-helvetica whitespace-nowrap">
                {isRtl ? 'تصفية حسب الوقت' : 'FILTER BY TIME'}
              </span>
              <svg className="w-2 h-[5px] opacity-60 shrink-0" viewBox="0 0 8 5" fill="none" aria-hidden>
                <path d="M1 1l3 3 3-3" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {loadH && history.length === 0 ? (
            <div className="flex justify-center py-10">
              <span className="animate-pulse text-white/40 text-sm font-helvetica">Loading…</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-white/30 text-sm text-center font-helvetica py-10">
              {isRtl ? 'لا توجد أسئلة سابقة منشورة حتى الآن' : 'No previous questions published yet'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
              {history.map((q) => {
                const qText = isRtl ? q.qAr : q.q;
                return (
                  <Link
                    key={q.id}
                    href={`/${locale}/wall/questions/${q.id}`}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="flex flex-col gap-2 items-start w-full hover:opacity-80 transition-opacity"
                  >
                    {q.week !== null && (
                      <p className="text-[12px] font-semibold tracking-[1.2px] text-[#E5E2E1]/40 uppercase font-helvetica">
                        WEEK {String(q.week).padStart(2, '0')}
                      </p>
                    )}
                    <h3
                      className={[
                        'text-white text-[28px] sm:text-[32px] leading-[1.25] font-semibold',
                        isRtl ? 'font-arabic text-right' : 'font-helvetica text-left',
                      ].join(' ')}
                    >
                      {qText}
                    </h3>
                    <div className="flex items-center gap-2 pt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={COMMENTS_SRC} alt=""
                        width={12} height={12}
                        className="shrink-0 opacity-40"
                        draggable={false}
                      />
                      <span className="text-[10px] font-normal text-[#E5E2E1]/40 uppercase font-helvetica whitespace-nowrap">
                        {q.count} RESPONSES
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination — replaces "load more" button */}
          {hTotalP > 1 && (
            <div className="flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                onClick={() => setHPage((p) => Math.max(1, p - 1))}
                disabled={hPage <= 1 || loadH}
                aria-label="Previous page"
                className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/20 disabled:opacity-40 hover:bg-white/10 transition-colors shrink-0"
              >
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d={isRtl ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="flex gap-2">
                {Array.from({ length: hDots }).map((_, di) => (
                  <div
                    key={di}
                    className={['size-[6px] rounded-full transition-colors', di === (hPage - 1) % hDots ? 'bg-primary' : 'bg-[#E5E2E1]/30'].join(' ')}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setHPage((p) => Math.min(hTotalP, p + 1))}
                disabled={hPage >= hTotalP || loadH}
                aria-label="Next page"
                className="size-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/20 disabled:opacity-40 hover:bg-white/10 transition-colors shrink-0"
              >
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
                    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}

        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
