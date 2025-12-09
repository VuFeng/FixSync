import { Badge } from "./ui/Badge";
import { Card } from "./ui/Card";
import { useDeviceLogs } from "../hooks/useLogs";
import { formatDateTime } from "../utils/format";

interface Props {
  deviceId: string;
}

export function RepairTimeline({ deviceId }: Props) {
  const { data: logs, isLoading, error } = useDeviceLogs(deviceId);

  if (isLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading timeline...</p>
      </Card>
    );
  }

  if (error || !logs || logs.length === 0) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">No timeline data</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Repair Timeline
      </h3>
      <div className="space-y-4">
        {logs.map((item, i) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary" />
              {i < logs.length - 1 && (
                <div className="w-0.5 h-12 bg-border mt-2" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-text-primary font-medium">
                    {item.action}
                  </p>
                  <p className="text-text-tertiary text-sm">
                    {item.createdBy?.fullName || "System"}
                  </p>
                </div>
                <Badge className="bg-surface-secondary text-text-tertiary text-xs">
                  {formatDateTime(item.createdAt)}
                </Badge>
              </div>
              <p className="text-text-secondary text-sm mt-1">
                {item.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}




