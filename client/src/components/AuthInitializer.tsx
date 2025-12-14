import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

/**
 * Component to initialize authentication state on app load
 * Should be placed at the root of the app
 */
export function AuthInitializer() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication when app loads
    checkAuth();
  }, [checkAuth]);

  return null;
}

