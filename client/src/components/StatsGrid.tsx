import { Smartphone, Wrench, DollarSign, CheckCircle } from "lucide-react";
import { Card } from "./ui/Card";
import { useDevices } from "../hooks/useDevices";
import { PAGINATION } from "../constants";
import { formatCurrency } from "../utils/format";
import { DeviceStatus } from "../types";
import { Skeleton } from "./ui/Skeleton";

export function StatsGrid() {
  const { data: devicesData, isLoading } = useDevices(
    PAGINATION.DEFAULT_PAGE,
    1000, // Get more devices for stats
    PAGINATION.DEFAULT_SORT_BY,
    PAGINATION.DEFAULT_SORT_DIR
  );

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
  // TODO: Calculate revenue from transactions
  const revenue = 0;

  const stats = [
    {
      label: "Total Devices",
      value: isLoading ? "..." : totalDevices,
      change: "+0%",
      icon: Smartphone,
      color: "bg-blue-500",
    },
    {
      label: "In Repair",
      value: isLoading ? "..." : inRepair,
      change: "+0%",
      icon: Wrench,
      color: "bg-yellow-500",
    },
    {
      label: "Revenue",
      value: isLoading ? "..." : formatCurrency(revenue),
      change: "+0%",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      label: "Completed",
      value: isLoading ? "..." : completed,
      change: "+0%",
      icon: CheckCircle,
      color: "bg-purple-500",
    },
  ];

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
                <p className="text-xs text-accent mt-2">
                  {stat.change} from last month
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

