import { useQuery } from "@tanstack/react-query";
import { warrantyService } from "../services/warranty.service";
import type { Warranty } from "../types";

export function useWarrantiesByDevice(deviceId: string | null) {
  return useQuery<Warranty[]>({
    queryKey: ["warranties", deviceId],
    queryFn: () => warrantyService.getByDevice(deviceId as string),
    enabled: !!deviceId,
  });
}




