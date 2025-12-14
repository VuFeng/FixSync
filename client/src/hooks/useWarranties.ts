import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { warrantyService } from "../services/warranty.service";
import type { Warranty, WarrantyRequest } from "../types";

export function useWarrantiesByDevice(deviceId: string | null) {
  return useQuery<Warranty[]>({
    queryKey: ["warranties", deviceId],
    queryFn: () => warrantyService.getByDevice(deviceId as string),
    enabled: !!deviceId,
  });
}

export function useWarranty(id: string | undefined) {
  return useQuery<Warranty>({
    queryKey: ["warranty", id],
    queryFn: () => warrantyService.getWarrantyById(id!),
    enabled: !!id,
  });
}

export function useCreateWarranty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WarrantyRequest) => warrantyService.createWarranty(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["warranties"] });
      if (data?.deviceId) {
        queryClient.invalidateQueries({ queryKey: ["device", data.deviceId] });
      }
    },
  });
}

export function useUpdateWarranty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WarrantyRequest }) =>
      warrantyService.updateWarranty(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["warranties"] });
      queryClient.invalidateQueries({ queryKey: ["warranty", variables.id] });
      if (data?.deviceId) {
        queryClient.invalidateQueries({ queryKey: ["device", data.deviceId] });
      }
    },
  });
}

export function useDeleteWarranty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => warrantyService.deleteWarranty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warranties"] });
    },
  });
}




