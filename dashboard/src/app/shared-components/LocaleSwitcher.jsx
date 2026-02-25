import { useDispatch, useSelector } from 'react-redux';
import { ButtonGroup, Button } from '@mui/material';
import { selectLocale, setLocale } from '../store/localeSlice';

export default function LocaleSwitcher() {
  const dispatch = useDispatch();
  const locale = useSelector(selectLocale);

  return (
    <ButtonGroup size="small" variant="outlined" sx={{ minWidth: 0 }}>
      <Button
        onClick={() => dispatch(setLocale('ar'))}
        variant={locale === 'ar' ? 'contained' : 'outlined'}
        sx={{ textTransform: 'none', px: 1.5 }}
      >
        عربي
      </Button>
      <Button
        onClick={() => dispatch(setLocale('en'))}
        variant={locale === 'en' ? 'contained' : 'outlined'}
        sx={{ textTransform: 'none', px: 1.5 }}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}
