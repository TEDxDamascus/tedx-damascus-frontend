import { Button } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function SpeakerHeader({ onSave, isNew, isSaving }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center gap-4">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/speakers')}
          variant="text"
          sx={{ color: '#EB0028' }}
        >
          Back to Speakers
        </Button>
        <h1 className="ml-4 text-2xl font-bold text-tedx-dark">
          {isNew ? 'Add New Speaker' : 'Edit Speaker'}
        </h1>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outlined"
          onClick={() => navigate('/speakers')}
          sx={{
            borderColor: '#e0e0e0',
            color: '#666',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={onSave}
          disabled={isSaving}
          sx={{
            backgroundColor: '#EB0028',
            '&:hover': { backgroundColor: '#C00020' },
          }}
        >
          {isSaving ? 'Saving...' : 'Save Speaker'}
        </Button>
      </div>
    </div>
  );
}

export default SpeakerHeader;
