import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function SpeakersListHeader() {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-tedx-dark">Speakers</h1>
        <p className="mt-2 text-gray-600">Manage your TEDx Damascus speakers</p>
      </div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => navigate('/speakers/add')}
        sx={{
          backgroundColor: 'var(--color-primary)',
          '&:hover': { backgroundColor: 'var(--color-primary-dark)' },
        }}
      >
        Add New Speaker
      </Button>
    </div>
  );
}

export default SpeakersListHeader;
