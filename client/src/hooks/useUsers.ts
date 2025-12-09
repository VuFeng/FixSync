import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { PAGINATION } from '../constants';

export function useUsers(
  page: number = PAGINATION.DEFAULT_PAGE,
  size: number = PAGINATION.DEFAULT_SIZE,
  sortBy: string = PAGINATION.DEFAULT_SORT_BY,
  sortDir: string = PAGINATION.DEFAULT_SORT_DIR
) {
  return useQuery({
    queryKey: ['users', page, size, sortBy, sortDir],
    queryFn: () => userService.getAllUsers(page, size, sortBy, sortDir),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}



