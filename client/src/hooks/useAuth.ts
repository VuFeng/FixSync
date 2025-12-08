import { useAuthStore } from '../stores/auth.store';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isTechnician: user?.role === 'TECHNICIAN',
    isReceptionist: user?.role === 'RECEPTIONIST',
  };
}

