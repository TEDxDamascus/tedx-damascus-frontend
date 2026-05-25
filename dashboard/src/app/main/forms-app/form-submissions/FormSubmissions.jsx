import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Visibility,
  Close,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { useGetFormQuery, useGetFormSubmissionsQuery } from '../FormsApi';
import { useTableState } from '../../../shared-components/custom-table';
import CustomTable from '../../../shared-components/custom-table';
import StatusBadge from '../../../shared-components/status-badge';
import Breadcrumb from '../../../shared-components/breadcrumb';

const TABLE_ID = 'form-submissions';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveLabel(obj) {
  return obj?.ar || obj?.en || '';
}

function formatAnswer(answer, question) {
  if (answer === undefined || answer === null || answer === '') return '—';

  switch (question?.type) {
    case 'single_choice': {
      const opt = (question.options ?? []).find((o) => o.id === answer);
      return resolveLabel(opt?.label) || answer;
    }
    case 'checkbox_group': {
      if (!Array.isArray(answer)) return String(answer);
      return answer
        .map((id) => {
          const opt = (question.options ?? []).find((o) => o.id === id);
          return resolveLabel(opt?.label) || id;
        })
        .join(' ، ');
    }
    case 'date_range':
      return answer?.start && answer?.end
        ? `${answer.start} → ${answer.end}`
        : '—';
    case 'rating':
      return `${answer} ★`;
    default:
      return typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
  }
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Detail drawer ────────────────────────────────────────────────────────────

function SubmissionDrawer({ submission, questions, onClose }) {
  if (!submission) return null;

  const sortedQs = [...questions].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">تفاصيل الطلب</h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <CalendarToday style={{ fontSize: 12 }} />
              {formatDate(submission.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={(submission.status ?? 'pending').toLowerCase()} />
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <Close style={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* Answers */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5" dir="rtl">
          {sortedQs
            .filter((q) => q.type !== 'section')
            .map((q) => {
              const answer = submission.answers?.[q.id];
              if (answer === undefined || answer === null || answer === '') return null;
              return (
                <div key={q.id} className="border-b border-gray-50 pb-4 last:border-0">
                  <p className="text-xs font-medium text-gray-400 mb-1">
                    {resolveLabel(q.title)}
                  </p>
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {formatAnswer(answer, q)}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FormSubmissions() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const { data: formResponse } = useGetFormQuery(formId);
  const form = formResponse?.data;
  const formName = resolveLabel(form?.name) || 'Form';

  const allQuestions = (form?.questions ?? []).sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  // First 3 non-section questions become table columns
  const colQuestions = allQuestions
    .filter((q) => q.type !== 'section')
    .slice(0, 3);

  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetFormSubmissionsQuery({ formId, ...params });

  const submissions = data?.data?.items ?? [];
  const totalCount = data?.data?.total ?? 0;

  const COLUMNS = [
    // Dynamic answer columns from the first 3 questions
    ...colQuestions.map((q) => ({
      id: `answer_${q.id}`,
      header: resolveLabel(q.title),
      renderCell: (_, row) => (
        <span className="text-sm text-gray-700" dir="rtl">
          {formatAnswer(row.answers?.[q.id], q)}
        </span>
      ),
    })),
    {
      id: 'status',
      header: 'Status',
      renderCell: (value) => (
        <StatusBadge status={(value ?? 'pending').toLowerCase()} />
      ),
    },
    {
      id: 'createdAt',
      header: 'Submitted At',
      sortable: true,
      renderCell: (value) => (
        <span className="text-sm text-gray-500">{formatDate(value)}</span>
      ),
    },
  ];

  const rowActions = (row) => [
    {
      icon: <Visibility style={{ fontSize: 18 }} />,
      label: 'View',
      onClick: () => setSelected(row),
    },
  ];

  return (
    <div className="p-6 pt-4">
      <Breadcrumb
        items={[
          { label: 'Forms', href: '/forms' },
          { label: formName, href: `/forms/${formId}` },
          { label: 'Submissions' },
        ]}
      />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-tedx-dark">Submissions</h1>
          <p className="mt-1 text-sm text-gray-500" dir="rtl">{formName}</p>
        </div>
        {totalCount > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            <Person style={{ fontSize: 16 }} />
            {totalCount}
          </span>
        )}
      </div>

      <CustomTable
        tableId={TABLE_ID}
        columns={COLUMNS}
        data={submissions}
        totalCount={totalCount}
        isLoading={isLoading}
        rowActions={rowActions}
        emptyMessage="No submissions yet for this form."
      />

      <SubmissionDrawer
        submission={selected}
        questions={allQuestions}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
