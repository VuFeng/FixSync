import { Card } from "./ui/Card";
import { Smartphone, Clock, User } from "lucide-react";
import { formatDate } from "../utils/format";
import { useDevices } from "../hooks/useDevices";
import { PAGINATION } from "../constants";
import { Skeleton } from "./ui/Skeleton";

export function RecentDevices() {
  const { data, isLoading } = useDevices(
    PAGINATION.DEFAULT_PAGE,
    5, // Only get 5 recent devices
    PAGINATION.DEFAULT_SORT_BY,
    PAGINATION.DEFAULT_SORT_DIR
  );

  const devices = data?.content || [];

  return (
    <Card className="bg-surface border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Recent Devices
        </h3>
        <button className="text-sm text-primary hover:text-primary-dark">
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 rounded-lg border border-border bg-surface-secondary">
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : devices.length === 0 ? (
        <div className="text-center py-8">
          <Smartphone className="w-12 h-12 text-text-tertiary mx-auto mb-3 opacity-50" />
          <p className="text-text-secondary text-sm">No devices yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className="p-3 rounded-lg border border-border bg-surface-secondary hover:bg-surface-secondary/80 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-text-tertiary" />
                    <p className="font-medium text-text-primary">
                      {device.brand?.name} {device.model?.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary mt-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{device.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(device.receivedDate)}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    device.status === "COMPLETED"
                      ? "bg-green-500/20 text-green-400"
                      : device.status === "REPAIRING"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {device.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

