import { useState } from 'react';
import { QuizOutlined, LockOutlined } from '@mui/icons-material';
import QuestionCard from './QuestionCard';
import AddQuestionPanel from './AddQuestionPanel';

export default function QuestionList({
  questions,
  lastAddedIndex,
  isPublished,
  isAddingQuestion,
  onAdd,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const [removingId, setRemovingId] = useState(null);

  const handleRemove = async (id) => {
    setRemovingId(id);
    await onRemove(id);
    setRemovingId(null);
  };

  return (
    <div>
      {/* Published warning banner */}
      {isPublished && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <LockOutlined style={{ fontSize: 18 }} className="shrink-0 text-amber-500" />
          <p className="text-sm text-amber-700">
            This form is <strong>published</strong>. Unpublish it first to add or edit questions.
          </p>
        </div>
      )}

      <div className="mb-4 flex items-center">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Questions
          <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-500">
            {questions.length}
          </span>
        </h3>
      </div>

      {questions.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400">
          <QuizOutlined sx={{ fontSize: 56, color: '#d1d5db', mb: 1.5 }} />
          <p className="text-sm">No questions yet. Add one below.</p>
        </div>
      ) : (
        <div className="mb-4 space-y-2">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={i}
              total={questions.length}
              defaultExpanded={i === lastAddedIndex}
              readOnly={isPublished}
              onUpdate={onUpdate}
              onRemove={handleRemove}
              onMoveUp={() => onMoveUp(q.id, i)}
              onMoveDown={() => onMoveDown(q.id, i)}
              isRemoving={removingId === q.id}
            />
          ))}
        </div>
      )}

      <AddQuestionPanel onAdd={onAdd} isAdding={isAddingQuestion} disabled={isPublished} />
    </div>
  );
}
