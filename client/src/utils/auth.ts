import { Role } from '../types';
import { useAuthStore } from '../stores/auth.store';

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: Role | undefined, requiredRole: Role): boolean {
  if (!userRole) return false;
  
  // Role hierarchy: ADMIN > TECHNICIAN > RECEPTIONIST
  const roleHierarchy: Record<Role, number> = {
    ADMIN: 3,
    TECHNICIAN: 2,
    RECEPTIONIST: 1,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRole: Role | undefined, requiredRoles: Role[]): boolean {
  if (!userRole) return false;
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: Role | undefined): boolean {
  return userRole === Role.ADMIN;
}

/**
 * Check if user is technician or admin
 */
export function isTechnicianOrAdmin(userRole: Role | undefined): boolean {
  return userRole === Role.TECHNICIAN || userRole === Role.ADMIN;
}

/**
 * Hook to check if current user has a specific role
 */
export function useHasRole(requiredRole: Role): boolean {
  const { user } = useAuthStore();
  return hasRole(user?.role, requiredRole);
}

/**
 * Hook to check if current user has any of the required roles
 */
export function useHasAnyRole(requiredRoles: Role[]): boolean {
  const { user } = useAuthStore();
  return hasAnyRole(user?.role, requiredRoles);
}

/**
 * Hook to check if current user is admin
 */
export function useIsAdmin(): boolean {
  const { user } = useAuthStore();
  return isAdmin(user?.role);
}

