import { AlertCircle, Phone, User } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { formatDate } from "../utils/format";
import type { Device } from "../types";

interface Props {
  device: Device;
}

export function DeviceDetailCard({ device }: Props) {
  return (
    <Card className="bg-surface border-border p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {device.brand?.name} {device.model?.name}
            </h2>
            <p className="text-text-tertiary text-sm">{device.deviceType}</p>
          </div>
          <Badge className="bg-blue-500/20 text-blue-400">
            {device.status.replace("_", " ")}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-text-tertiary text-sm mb-2">Customer</p>
            <p className="text-text-primary font-medium">{device.customerName}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Phone</p>
            <p className="text-text-primary font-mono text-sm">
              {device.customerPhone}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Color</p>
            <p className="text-text-primary">{device.color || "N/A"}</p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">IMEI</p>
            <p className="text-text-primary font-mono text-sm">
              {device.imei || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Received Date</p>
            <p className="text-text-primary">
              {formatDate(device.receivedDate)}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Expected Return</p>
            <p className="text-text-primary">
              {device.expectedReturnDate
                ? formatDate(device.expectedReturnDate)
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Customer Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-text-tertiary" />
              <div>
                <p className="text-text-tertiary text-sm">Customer Name</p>
                <p className="text-text-primary">{device.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-text-tertiary" />
              <div>
                <p className="text-text-tertiary text-sm">Phone Number</p>
                <p className="text-text-primary">{device.customerPhone}</p>
              </div>
            </div>
          </div>
        </div>

        {device.note && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 text-sm font-medium mb-1">Notes</p>
              <p className="text-yellow-400/80 text-sm">{device.note}</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}




