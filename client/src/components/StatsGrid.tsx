import {
  Smartphone,
  Wrench,
  DollarSign,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card } from "./ui/Card";
import { useDevices } from "../hooks/useDevices";
import { useTransactions } from "../hooks/useTransactions";
import { PAGINATION } from "../constants";
import { formatCurrency } from "../utils/format";
import { DeviceStatus } from "../types";
import { Skeleton } from "./ui/Skeleton";

export function StatsGrid() {
  const {
    data: devicesData,
    isLoading: devicesLoading,
    error: devicesError,
  } = useDevices(
    PAGINATION.DEFAULT_PAGE,
    500, // enough for stats
    "createdAt",
    "DESC"
  );

  const {
    data: txData,
    isLoading: txLoading,
    error: txError,
  } = useTransactions(0, 200, "createdAt", "DESC");

  const isLoading = devicesLoading || txLoading;
  const isError = devicesError || txError;

  const devices = devicesData?.content || [];
  const totalDevices = devices.length;
  const inRepair = devices.filter(
    (d) =>
      d.status === DeviceStatus.REPAIRING ||
      d.status === DeviceStatus.INSPECTING ||
      d.status === DeviceStatus.WAITING_PARTS
  ).length;
  const completed = devices.filter(
    (d) => d.status === DeviceStatus.COMPLETED
  ).length;

  const txs = txData?.content || [];
  const revenue = txs.reduce((sum, tx) => sum + (tx.finalAmount ?? 0), 0);

  const stats = [
    {
      label: "Total Devices",
      value: totalDevices,
      icon: Smartphone,
      color: "bg-blue-500",
    },
    {
      label: "In Repair",
      value: inRepair,
      icon: Wrench,
      color: "bg-yellow-500",
    },
    {
      label: "Revenue",
      value: formatCurrency(revenue),
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle,
      color: "bg-purple-500",
    },
  ];

  if (isError) {
    return (
      <Card className="bg-surface border-border p-6">
        <div className="flex items-center gap-3 text-danger">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-medium">Failed to load stats</p>
            <p className="text-sm text-text-secondary">
              Please refresh or try again later.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i} className="bg-surface border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-tertiary text-sm font-medium">
                  {stat.label}
                </p>
                {isLoading ? (
                  <Skeleton className="h-9 w-20 mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-text-primary mt-2">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-text-tertiary mt-2">
                  {/* Placeholder change info */}
                  vs last period — updating soon
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

