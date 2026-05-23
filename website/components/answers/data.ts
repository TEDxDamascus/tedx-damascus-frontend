export type TimeFilter = 'all' | '30d' | '90d';

export type PastQuestionMsgKey =
  | 'pastQ1'
  | 'pastQ2'
  | 'pastQ3'
  | 'pastQ4'
  | 'pastQ5'
  | 'pastQ6'
  | 'pastQ7'
  | 'pastQ8';

export type HistoryItem = {
  id: string;
  week: number;
  questionKey: PastQuestionMsgKey;
  responses: number;
  bucket: '30d' | '90d' | 'older';
  /** Paginated answers for this prompt (mock until CMS). */
  answerPages: AnswerItem[][];
};

export type AnswerItem = { id: string; textKey: string };

export const ANSWER_PAGES: AnswerItem[][] = [
  [
    { id: 'a1', textKey: 'mockAnswer1' },
    { id: 'a2', textKey: 'mockAnswer2' },
    { id: 'a3', textKey: 'mockAnswer3' },
  ],
  [
    { id: 'b1', textKey: 'mockAnswer4' },
    { id: 'b2', textKey: 'mockAnswer5' },
  ],
  [
    { id: 'c1', textKey: 'mockAnswer6' },
    { id: 'c2', textKey: 'mockAnswer7' },
    { id: 'c3', textKey: 'mockAnswer8' },
  ],
  [
    { id: 'd1', textKey: 'mockAnswer9' },
    { id: 'd2', textKey: 'mockAnswer10' },
  ],
];

export const HISTORY_MOCK: HistoryItem[] = [
  { id: 'h1', week: 12, questionKey: 'pastQ1', responses: 24, bucket: '30d', answerPages: ANSWER_PAGES },
  {
    id: 'h2',
    week: 11,
    questionKey: 'pastQ2',
    responses: 18,
    bucket: '30d',
    answerPages: [ANSWER_PAGES[2], ANSWER_PAGES[0]],
  },
  {
    id: 'h3',
    week: 10,
    questionKey: 'pastQ3',
    responses: 31,
    bucket: '90d',
    answerPages: [ANSWER_PAGES[1], ANSWER_PAGES[3], ANSWER_PAGES[0]],
  },
  {
    id: 'h4',
    week: 9,
    questionKey: 'pastQ4',
    responses: 12,
    bucket: '90d',
    answerPages: [ANSWER_PAGES[3], ANSWER_PAGES[1]],
  },
  {
    id: 'h5',
    week: 8,
    questionKey: 'pastQ5',
    responses: 42,
    bucket: 'older',
    answerPages: [
      [
        { id: 'h5-a', textKey: 'mockAnswer9' },
        { id: 'h5-b', textKey: 'mockAnswer10' },
      ],
      ANSWER_PAGES[0],
    ],
  },
  {
    id: 'h6',
    week: 7,
    questionKey: 'pastQ6',
    responses: 9,
    bucket: 'older',
    answerPages: [ANSWER_PAGES[1], ANSWER_PAGES[2]],
  },
  {
    id: 'h7',
    week: 6,
    questionKey: 'pastQ7',
    responses: 56,
    bucket: 'older',
    answerPages: [ANSWER_PAGES[0], ANSWER_PAGES[2], ANSWER_PAGES[3]],
  },
  {
    id: 'h8',
    week: 5,
    questionKey: 'pastQ8',
    responses: 21,
    bucket: 'older',
    answerPages: [
      [{ id: 'h8-a', textKey: 'mockAnswer4' }, { id: 'h8-b', textKey: 'mockAnswer5' }],
      [{ id: 'h8-c', textKey: 'mockAnswer6' }],
      [{ id: 'h8-d', textKey: 'mockAnswer7' }, { id: 'h8-e', textKey: 'mockAnswer8' }],
    ],
  },
];
