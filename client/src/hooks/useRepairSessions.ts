import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repairSessionService } from '../services/repairSession.service';
import { PAGINATION } from '../constants';
import { useToast } from './useToast';
import type { RepairSessionRequest } from '../types';

export function useRepairSessions(
  page: number = PAGINATION.DEFAULT_PAGE,
  size: number = PAGINATION.DEFAULT_SIZE,
  sortBy: string = 'createdAt',
  sortDir: string = PAGINATION.DEFAULT_SORT_DIR,
  deviceId?: string
) {
  return useQuery({
    queryKey: ['repair-sessions', page, size, sortBy, sortDir, deviceId],
    queryFn: () => repairSessionService.getAllSessions(page, size, sortBy, sortDir, deviceId),
  });
}

export function useRepairSession(id: string | undefined) {
  return useQuery({
    queryKey: ['repair-session', id],
    queryFn: () => repairSessionService.getSessionById(id!),
    enabled: !!id,
  });
}

export function useRepairSessionsByDevice(deviceId: string | undefined) {
  return useQuery({
    queryKey: ['repair-sessions', 'device', deviceId],
    queryFn: () => repairSessionService.getSessionsByDevice(deviceId!),
    enabled: !!deviceId,
  });
}

export function useCreateRepairSession() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: RepairSessionRequest) => repairSessionService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Repair session created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create repair session');
    },
  });
}

export function useUpdateRepairSession() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RepairSessionRequest }) =>
      repairSessionService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repair-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Repair session updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update repair session');
    },
  });
}



