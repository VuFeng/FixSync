import { Link } from "react-router-dom";
import { AlertCircle, Phone, User, Edit2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { formatDate } from "../utils/format";
import { ROUTES } from "../constants";
import type { Device } from "../types";
import { formatCurrency } from "../utils/format";

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
          <div className="flex flex-col items-end gap-2">
            <div className="text-right text-sm text-text-secondary">
              <div>
                <span className="text-text-tertiary mr-2">Subtotal:</span>
                <span className="text-text-primary font-semibold">
                  {formatCurrency(device.repairSubtotal ?? 0)}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary mr-2">Outstanding:</span>
                <span className="text-primary font-semibold">
                  {formatCurrency(device.outstandingAmount ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-text-tertiary text-sm mb-2">Customer</p>
            <p className="text-text-primary font-medium">
              {device.customer?.name || device.customerName || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Phone</p>
            <p className="text-text-primary font-mono text-sm">
              {device.customer?.phone || device.customerPhone || "N/A"}
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
            <p className="text-text-tertiary text-sm mb-2">Created At</p>
            <p className="text-text-primary">
              {formatDate(device.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary text-sm mb-2">Updated At</p>
            <p className="text-text-primary">
              {formatDate(device.updatedAt)}
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
                <p className="text-text-primary">
                  {device.customer?.name || device.customerName || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-text-tertiary" />
              <div>
                <p className="text-text-tertiary text-sm">Phone Number</p>
                <p className="text-text-primary">
                  {device.customer?.phone || device.customerPhone || "N/A"}
                </p>
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

        <div className="flex gap-2 pt-4 border-t border-border">
          <Link to={ROUTES.DEVICES + `/${device.id}/edit`} className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary-dark">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Device
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}




