import { useQuery } from "@tanstack/react-query";
import { logService } from "../services/log.service";
import type { RealtimeLog } from "../types";

export function useDeviceLogs(deviceId: string | null) {
  return useQuery<RealtimeLog[]>({
    queryKey: ["logs", deviceId],
    queryFn: () => logService.getByDevice(deviceId as string),
    enabled: !!deviceId,
  });
}




