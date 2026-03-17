import { useState } from 'react';
import { QuizOutlined } from '@mui/icons-material';
import QuestionCard from './QuestionCard';
import AddQuestionPanel from './AddQuestionPanel';

export default function QuestionList({
  questions,
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
              onUpdate={onUpdate}
              onRemove={handleRemove}
              onMoveUp={() => onMoveUp(q.id, i)}
              onMoveDown={() => onMoveDown(q.id, i)}
              isRemoving={removingId === q.id}
            />
          ))}
        </div>
      )}

      <AddQuestionPanel onAdd={onAdd} isAdding={isAddingQuestion} />
    </div>
  );
}
