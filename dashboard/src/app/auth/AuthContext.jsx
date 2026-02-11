import { createContext, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout as logoutAction } from './store/userSlice';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const signIn = async (email, password) => {
    if (email && password) {
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin'
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem('tedx_token', mockToken);
      localStorage.setItem('tedx_user', JSON.stringify(mockUser));

      dispatch(setUser(mockUser));
      enqueueSnackbar('Login successful!', { variant: 'success' });
      navigate('/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch(logoutAction());
    enqueueSnackbar('Logged out successfully', { variant: 'info' });
    navigate('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
