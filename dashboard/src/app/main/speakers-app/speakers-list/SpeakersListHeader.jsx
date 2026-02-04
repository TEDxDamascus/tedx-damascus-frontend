import { Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function SpeakersListHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-tedx-dark">Speakers</h1>
        <p className="mt-2 text-gray-600">Manage your TEDx Damascus speakers</p>
      </div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => navigate('/speakers/new')}
        sx={{
          backgroundColor: '#EB0028',
          '&:hover': { backgroundColor: '#C00020' }
        }}
      >
        Add New Speaker
      </Button>
    </div>
  );
}

export default SpeakersListHeader;
