import { AlertTriangle, Clock, User } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Skeleton } from "./ui/Skeleton";
import { useRepairSessions } from "../hooks/useRepairSessions";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { formatDate } from "../utils/format";
import { DeviceStatus, type RepairSession } from "../types";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

interface SessionWithDevice extends RepairSession {
  device?: {
    id: string;
    brand?: { name: string };
    model?: { name: string };
    customer?: { name: string; phone: string };
    customerName?: string;
    customerPhone?: string;
  };
}

function filterSessions(
  sessions: SessionWithDevice[],
  predicate: (s: SessionWithDevice) => boolean,
  limit = 5
) {
  return sessions
    .filter(predicate)
    .sort((a, b) => {
      const da = a.expectedReturnDate
        ? new Date(a.expectedReturnDate).getTime()
        : Infinity;
      const db = b.expectedReturnDate
        ? new Date(b.expectedReturnDate).getTime()
        : Infinity;
      return da - db;
    })
    .slice(0, limit);
}

const statusColor: Record<string, string> = {
  RECEIVED: "bg-blue-500/20 text-blue-400",
  INSPECTING: "bg-yellow-500/20 text-yellow-400",
  WAITING_PARTS: "bg-orange-500/20 text-orange-400",
  REPAIRING: "bg-purple-500/20 text-purple-400",
  COMPLETED: "bg-emerald-500/20 text-emerald-400",
  RETURNED: "bg-gray-500/20 text-gray-400",
};

function SessionItem({ session }: { session: SessionWithDevice }) {
  const { data: device } = useDevice(session.deviceId);

  const deviceInfo = device || session.device;

  return (
    <Link to={ROUTES.DEVICE_DETAIL(session.deviceId)}>
      <div className="p-2.5 rounded-lg border border-border bg-surface-secondary hover:bg-surface-secondary/80 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary text-sm truncate">
              {deviceInfo?.brand?.name}{" "}
              {deviceInfo?.model?.name || "Loading..."}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary mt-1">
              <span className="flex items-center gap-1 truncate">
                <User className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {deviceInfo?.customer?.name ||
                    deviceInfo?.customerName ||
                    "N/A"}
                </span>
              </span>
              {session.expectedReturnDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">
                    {formatDate(session.expectedReturnDate)}
                  </span>
                </span>
              )}
            </div>
          </div>
          <Badge
            className={`${
              statusColor[session.status || ""] ||
              "bg-gray-500/20 text-gray-400"
            } text-xs shrink-0`}
          >
            {session.status ? session.status.replace("_", " ") : "N/A"}
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function DeviceAlerts() {
  // Lấy tất cả repair sessions với size lớn để có đủ dữ liệu
  const { data, isLoading, error } = useRepairSessions(
    0,
    1000, // Lấy nhiều sessions để filter
    "expectedReturnDate",
    "ASC"
  );

  const sessions = useMemo(() => data?.content || [], [data?.content]);

  const [now] = useState(() => Date.now());
  const next72h = now + 72 * 60 * 60 * 1000;

  const upcoming = useMemo(
    () =>
      filterSessions(
        sessions,
        (s) =>
          !!s.expectedReturnDate &&
          s.status !== DeviceStatus.COMPLETED &&
          s.status !== DeviceStatus.RETURNED &&
          new Date(s.expectedReturnDate).getTime() >= now &&
          new Date(s.expectedReturnDate).getTime() <= next72h
      ),
    [sessions, now, next72h]
  );

  const overdue = useMemo(
    () =>
      filterSessions(
        sessions,
        (s) =>
          !!s.expectedReturnDate &&
          s.status !== DeviceStatus.COMPLETED &&
          s.status !== DeviceStatus.RETURNED &&
          new Date(s.expectedReturnDate).getTime() < now
      ),
    [sessions, now]
  );

  const renderList = (items: SessionWithDevice[], emptyText: string) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center gap-2 text-danger bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-xs">
          <AlertTriangle className="w-3 h-3" />
          <span>Failed to load repair sessions.</span>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <p className="text-xs text-text-secondary text-center py-3">
          {emptyText}
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-surface border-border p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Device Alerts
        </h3>
        <p className="text-sm text-text-tertiary">
          Upcoming returns and overdue devices
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-text-primary">
              Upcoming Returns (72h)
            </h4>
            {upcoming.length > 0 && (
              <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                {upcoming.length}
              </Badge>
            )}
          </div>
          <div className="max-h-48 overflow-y-scroll no-scrollbar">
            {renderList(upcoming, "No upcoming returns")}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-text-primary">
              Overdue Devices
            </h4>
            {overdue.length > 0 && (
              <Badge className="bg-red-500/20 text-red-400 text-xs">
                {overdue.length}
              </Badge>
            )}
          </div>
          <div className="max-h-48 overflow-y-scroll no-scrollbar">
            {renderList(overdue, "No overdue devices")}
          </div>
        </div>
      </div>
    </Card>
  );
}
