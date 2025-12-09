import { CheckCircle, Shield } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { useWarrantiesByDevice } from "../hooks/useWarranties";
import { formatDate } from "../utils/format";

interface Props {
  deviceId: string;
}

export function WarrantyInfo({ deviceId }: Props) {
  const { data, isLoading, error } = useWarrantiesByDevice(deviceId);
  const warranty = data?.[0];

  if (isLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading warranty...</p>
      </Card>
    );
  }

  if (error || !warranty) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">No warranty info.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">Warranty</h3>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-text-tertiary text-sm mb-1">Warranty Code</p>
          <p className="text-text-primary font-mono text-sm">
            {warranty.warrantyCode || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-sm mb-1">Valid Period</p>
          <p className="text-text-primary">
            {formatDate(warranty.startDate)} to {formatDate(warranty.endDate)}
          </p>
        </div>
        <div>
          <Badge className="bg-emerald-500/20 text-emerald-400 mb-3">
            ACTIVE
          </Badge>
        </div>
        {warranty.repairItemId && (
          <div>
            <p className="text-text-tertiary text-sm mb-2">Coverage</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Linked to repair item {warranty.warrantyCode}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}


