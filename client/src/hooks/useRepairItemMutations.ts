import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repairItemService } from "../services/repairItem.service";

export function useCreateRepairItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repairItemService.createRepairItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repair-items"] });
    },
  });
}

export function useUpdateRepairItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof repairItemService.updateRepairItem>[1];
    }) => repairItemService.updateRepairItem(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["repair-items"] });
      queryClient.invalidateQueries({ queryKey: ["repair-item", variables.id] });
    },
  });
}

export function useDeleteRepairItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: repairItemService.deleteRepairItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repair-items"] });
    },
  });
}




