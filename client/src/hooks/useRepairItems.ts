import { useQuery } from "@tanstack/react-query";
import { repairItemService } from "../services/repairItem.service";
import type { PageResponse, RepairItem } from "../types";

export function useRepairItems(
  deviceId: string | null,
  page: number = 0,
  size: number = 10,
  sortBy: string = "createdAt",
  sortDir: string = "DESC"
) {
  return useQuery<PageResponse<RepairItem>>({
    queryKey: ["repair-items", deviceId, page, size, sortBy, sortDir],
    queryFn: () =>
      deviceId
        ? repairItemService.getRepairItemsByDevice(
            deviceId,
            page,
            size,
            sortBy,
            sortDir
          )
        : repairItemService.getAllRepairItems(page, size, sortBy, sortDir),
    enabled: true,
  });
}

export function useRepairItem(id: string | undefined) {
  return useQuery<RepairItem>({
    queryKey: ["repair-item", id],
    queryFn: () => repairItemService.getRepairItemById(id!),
    enabled: !!id,
  });
}


