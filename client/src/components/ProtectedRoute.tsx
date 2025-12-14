import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { SkeletonCard } from './ui/Skeleton';

export function ProtectedRoute() {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication on mount
    const isValid = checkAuth();
    // Use setTimeout to defer state update and avoid cascading renders
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 0);
    
    if (!isValid && !isAuthenticated) {
      // Auth check failed, will redirect to login
    }
    
    return () => clearTimeout(timer);
  }, [checkAuth, isAuthenticated]);

  // Show loading while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SkeletonCard />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}



