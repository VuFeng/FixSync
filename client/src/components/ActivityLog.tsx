import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { useDeviceLogs } from "../hooks/useLogs";
import { formatDateTime } from "../utils/format";

interface Props {
  deviceId: string;
}

export function ActivityLog({ deviceId }: Props) {
  const { data, isLoading, error } = useDeviceLogs(deviceId);

  if (isLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading activity...</p>
      </Card>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">No activity logs.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Activity</h3>

      <div className="space-y-3">
        {data.map((log) => (
          <div
            key={log.id}
            className="pb-3 border-b border-border last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-text-primary text-sm font-medium">
                {log.action}
              </p>
              <Badge className="bg-surface-secondary text-text-tertiary text-xs">
                {formatDateTime(log.createdAt)}
              </Badge>
            </div>
            <p className="text-text-tertiary text-xs">
              {log.createdBy?.fullName || "System"}
            </p>
            {log.detail && (
              <p className="text-text-secondary text-sm mt-1">{log.detail}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}




