'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getISOWeek } from 'date-fns';
import { Navbar, Footer } from '@/components/layout';
import { wallApi } from '@/lib/api/client';

const PATTERN_SRC = '/images/about/pattern.svg';
const COMMENTS_SRC = '/images/add-your-line/Comments.svg';
const ANSWERS_BATCH = 12;
const ANSWERS_VIEW = 3;
const H_LIMIT = 4;

interface ARow { id: string; text: string }
interface QRow {
  id: string;
  q: string;
  qAr: string;
  week: number | null;
  count: number;
  publishedAt: string;
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
      publishedAt: q.publishedAt ?? q.createdAt ?? '',
    };
  });
}

function QuestionsListInner({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const router = useRouter();

  const [current, setCurrent]     = useState<any>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [answers, setAnswers]     = useState<ARow[]>([]);
  const [viewIdx, setViewIdx]     = useState(0);
  const [aBatch, setABatch]       = useState(1);
  const [totalA, setTotalA]       = useState(0);
  const [loadA, setLoadA]         = useState(false);

  const [history, setHistory]     = useState<QRow[]>([]);
  const [hPage, setHPage]         = useState(1);
  const [hTotalP, setHTotalP]     = useState(1);
  const [loadH, setLoadH]         = useState(false);
  const [selId, setSelId]         = useState<string | null>(null);

  useEffect(() => {
    wallApi.getCurrent().then((d: any) => {
      const r = d?.data ?? d;
      setCurrent(r);
      const qId = r?.question?.id ?? r?.id;
      if (qId) {
        setCurrentId(String(qId));
        try { localStorage.setItem(`tedx_question_${qId}`, JSON.stringify(r?.question ?? r)); } catch {}
      }
      const rawAnswers: any[] = r?.answers ?? [];
      if (rawAnswers.length > 0) {
        setAnswers(rawAnswers.map((a: any) => ({
          id: String(a.id),
          text: a.text ?? '',
        })));
        setTotalA(rawAnswers.length);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!currentId) return;
    setLoadA(true);
    wallApi.getQuestionAnswers(currentId, { page: aBatch, limit: ANSWERS_BATCH })
      .then((res: any) => {
        const raw: any[] = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : res?.answers ?? (Array.isArray(res) ? res : []));
        const rows: ARow[] = raw.map((a: any) => ({
          id: String(a.id),
          text: (isRtl ? (a.textAr ?? a.text) : a.text) ?? '',
        }));
        if (aBatch === 1) {
          setAnswers(rows);
        } else {
          setAnswers((p) => [...p, ...rows]);
        }
        setTotalA(res?.data?.total ?? res?.total ?? res?.totalCount ?? raw.length);
      })
      .catch(() => {})
      .finally(() => setLoadA(false));
  }, [currentId, aBatch, isRtl]);

  useEffect(() => {
    setLoadH(true);
    wallApi.getQuestions({ page: 1, limit: H_LIMIT })
      .then((res: any) => {
        const raw: any[] = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        raw.forEach((q: any) => {
          if (q.id) {
            try { localStorage.setItem(`tedx_question_${q.id}`, JSON.stringify(q)); } catch {}
          }
        });
        setHistory(normalizeQuestions(raw));
        const tot = res?.data?.total ?? res?.total ?? raw.length;
        setHTotalP(res?.data?.totalPages ?? res?.totalPages ?? Math.max(1, Math.ceil(tot / H_LIMIT)));
        setHPage(1);
      })
      .catch(() => {})
      .finally(() => setLoadH(false));
  }, []);

  function loadMoreHistory() {
    const next = hPage + 1;
    setLoadH(true);
    wallApi.getQuestions({ page: next, limit: H_LIMIT })
      .then((res: any) => {
        const raw: any[] = res?.data?.items ?? (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        setHistory((p) => [...p, ...normalizeQuestions(raw)]);
        setHPage(next);
      })
      .catch(() => {})
      .finally(() => setLoadH(false));
  }

  const chunks: ARow[][] = [];
  for (let i = 0; i < answers.length; i += ANSWERS_VIEW)
    chunks.push(answers.slice(i, i + ANSWERS_VIEW));

  const totalApiP = Math.max(1, Math.ceil(totalA / ANSWERS_BATCH));
  const hasPrev   = viewIdx > 0;
  const hasNext   = viewIdx < chunks.length - 1 || aBatch < totalApiP;
  const dots      = Math.min(4, Math.max(1, chunks.length));
  const shown     = chunks[viewIdx] ?? [];

  function nextA() {
    if (viewIdx < chunks.length - 1) { setViewIdx((p) => p + 1); return; }
    if (aBatch < totalApiP) { setABatch((p) => p + 1); setViewIdx(0); }
  }
  function prevA() {
    if (viewIdx > 0) setViewIdx((p) => p - 1);
  }

  function extractQText(wall: any): string {
    if (!wall) return '';
    const q = wall.question;
    if (!q) return '';
    if (typeof q === 'object') return (isRtl ? (q.textAr ?? q.text) : q.text) ?? '';
    if (typeof q === 'string') return q;
    return '';
  }
  const qText = extractQText(current);

  function handleHistoryClick(id: string) {
    setSelId(id);
    router.push(`/${locale}/wall/questions/detail?id=${id}`);
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-[#101010] overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 overflow-hidden" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PATTERN_SRC}
            alt=""
            className={['absolute inset-0 h-[200px] w-full object-cover object-top select-none', isRtl ? 'scale-x-[-1]' : ''].join(' ')}
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101010] to-transparent" />
        </div>

        <div className="relative z-10">
          <Navbar locale={locale} />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-12 lg:px-[80px] pt-[70px] pb-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-start">

            {/* LEFT: Current question */}
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
                  {qText || (isRtl
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

            {/* RIGHT: Answer cards */}
            <div className="lg:col-span-5 lg:col-start-8">
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
                <>
                  {shown.map((a, i) => (
                    <div
                      key={a.id}
                      className={[
                        'relative rounded-xl border border-white/10 bg-white/[0.02] px-10 pb-10 pt-10',
                        i > 0 ? 'mt-4' : '',
                      ].join(' ')}
                    >
                      <span
                        className="absolute top-[54px] left-6 -translate-y-1/2 text-[60px] leading-[60px] text-primary opacity-20 font-serif select-none pointer-events-none"
                        aria-hidden
                      >&ldquo;</span>
                      <div className="border-l-2 border-primary pl-[18px]">
                        <p className="text-white/90 text-base leading-[1.8] font-helvetica">{a.text}</p>
                      </div>
                    </div>
                  ))}

                  {(dots > 1 || hasNext || hasPrev) && (
                    <div className="flex items-center justify-center gap-6 pt-6">
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
                        {Array.from({ length: dots }).map((_, di) => (
                          <div
                            key={di}
                            className={['size-[6px] rounded-full transition-colors', di === viewIdx % dots ? 'bg-primary' : 'bg-[#E5E2E1]/30'].join(' ')}
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
                  )}
                </>
              )}

              {currentId && (
                <div className="mt-8 flex justify-center">
                  <Link
                    href={`/${locale}/wall/questions/detail?id=${currentId}`}
                    className={[
                      'inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-[0.08em]',
                      'hover:opacity-80 transition-opacity',
                      isRtl ? 'font-arabic normal-case tracking-normal flex-row-reverse' : 'font-helvetica',
                    ].join(' ')}
                  >
                    <span>{isRtl ? 'عرض جميع الإجابات' : 'View All Answers'}</span>
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d={isRtl ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
                        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Question History ──────────────────────────── */}
      <section
        className="bg-[#101010] border-t border-white/5 px-6 sm:px-12 lg:px-[80px] pt-[65px] pb-[64px]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-[1280px] flex flex-col gap-12">

          {/* Header */}
          <div className="flex flex-col gap-4">
            <p className="text-primary text-[12px] font-semibold tracking-[3.6px] uppercase font-helvetica">
              {isRtl ? 'أسئلة سابقة' : 'QUESTION HISTORY'}
            </p>
            <div className="w-24 h-px bg-primary" />
          </div>

          {/* Filter button */}
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

          {/* Grid */}
          {loadH && history.length === 0 ? (
            <div className="flex justify-center py-10">
              <span className="animate-pulse text-white/40 text-sm font-helvetica">Loading…</span>
            </div>
          ) : history.length === 0 ? (
            <p className="text-white/30 text-sm text-center font-helvetica py-10">
              {isRtl ? 'لا توجد أسئلة سابقة' : 'No past questions'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-12">
              {history.map((q) => {
                const qText = isRtl ? q.qAr : q.q;
                const isSel = selId === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleHistoryClick(q.id)}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className={[
                      'flex flex-col gap-2 items-start w-full transition-all duration-200',
                      isRtl ? 'border-r-2 pr-4' : 'border-l-2 pl-4',
                      isSel ? 'border-primary' : 'border-transparent',
                    ].join(' ')}
                  >
                    {q.week !== null && (
                      <p className="text-[12px] font-semibold tracking-[1.2px] text-[#E5E2E1]/40 uppercase font-helvetica">
                        WEEK {String(q.week).padStart(2, '0')}
                      </p>
                    )}
                    <h3
                      className={[
                        'text-white text-[28px] sm:text-[32px] leading-[1.25] font-semibold text-left',
                        isRtl ? 'font-arabic text-right' : 'font-helvetica',
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
                  </button>
                );
              })}
            </div>
          )}

          {/* Load more */}
          {hPage < hTotalP && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={loadMoreHistory}
                disabled={loadH}
                className="border-b-2 border-primary pb-[10px] text-white text-[12px] font-semibold tracking-[1.2px] uppercase font-helvetica hover:text-primary transition-colors disabled:opacity-50"
              >
                {loadH ? '…' : (isRtl ? 'عرض جميع الأسئلة السابقة' : 'VIEW ALL PAST QUESTIONS')}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer locale={locale} />
    </>
  );
}

export function QuestionsListClient({ locale }: { locale: string }) {
  return <QuestionsListInner locale={locale} />;
}
