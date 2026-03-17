import { useParams, useNavigate } from 'react-router-dom';
import { Visibility } from '@mui/icons-material';
import { useGetFormQuery, useGetFormSubmissionsQuery } from '../FormsApi';
import { useTableState } from '../../../shared-components/custom-table';
import CustomTable from '../../../shared-components/custom-table';
import StatusBadge from '../../../shared-components/status-badge';
import Breadcrumb from '../../../shared-components/breadcrumb';

const TABLE_ID = 'form-submissions';

const COLUMNS = [
  {
    id: 'submittedBy',
    header: 'Submitted By',
    sortable: true,
    renderCell: (value, row) => (
      <div>
        <p className="font-medium text-tedx-dark">{value ?? row.applicantName ?? '—'}</p>
        {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    renderCell: (value) => <StatusBadge status={(value ?? 'pending').toLowerCase()} />,
  },
  {
    id: 'answers',
    header: 'Answers',
    renderCell: (value, row) => (
      <span className="text-sm text-gray-500">
        {Array.isArray(value) ? value.length : (row.answersCount ?? '—')}
      </span>
    ),
  },
  {
    id: 'createdAt',
    header: 'Submitted At',
    sortable: true,
    renderCell: (value) =>
      value
        ? new Date(value).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        : '—',
  },
];

export default function FormSubmissions() {
  const { formId } = useParams();
  const navigate = useNavigate();

  const { data: formResponse } = useGetFormQuery(formId);
  const form = formResponse?.data;
  const formName = form?.name?.en || form?.name?.ar || 'Form';

  const { params } = useTableState(TABLE_ID);
  const { data, isLoading } = useGetFormSubmissionsQuery({ formId, ...params });

  const submissions = data?.data?.items ?? data?.data ?? [];
  const totalCount = data?.data?.total ?? data?.total ?? 0;

  const rowActions = (row) => [
    {
      icon: <Visibility style={{ fontSize: 18 }} />,
      label: 'View Submission',
      onClick: () => navigate(`/forms/${formId}/submissions/${row.id}`),
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

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-tedx-dark">Submissions</h1>
        <p className="mt-1 text-sm text-gray-500">{formName}</p>
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
    </div>
  );
}
