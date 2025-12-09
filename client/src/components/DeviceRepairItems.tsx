import { Plus, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { useRepairItems } from "../hooks/useRepairItems";
import { formatCurrency, formatDate } from "../utils/format";
import { SkeletonCard } from "./ui/Skeleton";

interface Props {
  deviceId: string;
}

export function DeviceRepairItems({ deviceId }: Props) {
  const { data, isLoading, error } = useRepairItems(deviceId, 0, 50);
  const items = data?.content || [];
  const total = items.reduce((sum, item) => sum + (item.cost || 0), 0);

  if (isLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <SkeletonCard />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-danger">Error loading repair items.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Repair Services
        </h3>
        <Button size="sm" className="bg-primary hover:bg-primary-dark">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="space-y-3 mb-4">
        {items.length === 0 ? (
          <p className="text-text-secondary text-sm">No repair items.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-secondary p-4 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <p className="text-text-primary font-medium">
                    {item.serviceName}
                  </p>
                  <p className="text-text-tertiary text-sm">
                    {item.partUsed || "No part specified"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-text-tertiary hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {formatCurrency(item.cost || 0)}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {item.warrantyMonths || 0} months warranty
                  </Badge>
                </div>
                <span className="text-text-tertiary text-xs">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-medium">Total Cost</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}



