import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { selectIsAuthenticated, setUser } from './store/userSlice';

function AuthGuard({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('tedx_token');
    const userData = localStorage.getItem('tedx_user');

    if (token && userData && !isAuthenticated) {
      try {
        dispatch(setUser(JSON.parse(userData)));
      } catch (error) {
        localStorage.removeItem('tedx_token');
        localStorage.removeItem('tedx_user');
      }
    }
  }, [dispatch, isAuthenticated]);

  const token = localStorage.getItem('tedx_token');

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

export default AuthGuard;
