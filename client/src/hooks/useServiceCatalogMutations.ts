import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  serviceCatalogService,
  type ServiceCatalogRequest,
} from "../services/serviceCatalog.service";

export function useCreateServiceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ServiceCatalogRequest) =>
      serviceCatalogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-catalog"] });
    },
  });
}

export function useUpdateServiceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceCatalogRequest }) =>
      serviceCatalogService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["service-catalog"] });
      queryClient.invalidateQueries({
        queryKey: ["service-catalog", variables.id],
      });
    },
  });
}

export function useDeleteServiceCatalog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => serviceCatalogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-catalog"] });
    },
  });
}



