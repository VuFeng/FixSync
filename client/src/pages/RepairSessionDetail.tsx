import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useRepairSession } from "../hooks/useRepairSessions";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { formatDate, formatDateTime } from "../utils/format";
import { SkeletonCard } from "../components/ui/Skeleton";
import { DeviceStatus } from "../types";

const statusColors: Record<DeviceStatus, string> = {
  RECEIVED: "bg-blue-500/20 text-blue-300",
  INSPECTING: "bg-yellow-500/20 text-yellow-300",
  WAITING_PARTS: "bg-orange-500/20 text-orange-300",
  REPAIRING: "bg-purple-500/20 text-purple-300",
  COMPLETED: "bg-emerald-500/20 text-emerald-300",
  RETURNED: "bg-green-500/20 text-green-300",
};

export default function RepairSessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, error } = useRepairSession(id);
  const { data: device } = useDevice(session?.deviceId || "");

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <SkeletonCard />
        </div>
      </>
    );
  }

  if (error || !session) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <div className="text-danger">Failed to load repair session</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to={ROUTES.REPAIR_SESSIONS}>
            <Button
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Repair Sessions
            </Button>
          </Link>
          <Link to={ROUTES.REPAIR_SESSION_EDIT(session.id)}>
            <Button variant="outline" className="border-border">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Session
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-surface border-border p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Repair Session Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Status</span>
                  <Badge className={statusColors[session.status] || ""}>
                    {session.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Received Date</span>
                  <span className="text-text-primary">
                    {formatDateTime(session.receivedDate)}
                  </span>
                </div>
                {session.expectedReturnDate && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Expected Return Date</span>
                    <span className="text-text-primary">
                      {formatDateTime(session.expectedReturnDate)}
                    </span>
                  </div>
                )}
                {session.assignedTo && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-text-secondary">Assigned To</span>
                    <span className="text-text-primary">
                      {session.assignedTo.fullName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Created By</span>
                  <span className="text-text-primary">
                    {session.createdBy.fullName}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Created At</span>
                  <span className="text-text-primary">
                    {formatDate(session.createdAt)}
                  </span>
                </div>
                {session.note && (
                  <div className="pt-4">
                    <p className="text-text-secondary mb-2">Note</p>
                    <p className="text-text-primary whitespace-pre-wrap">{session.note}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {device && (
              <Card className="bg-surface border-border p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Device Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Customer</span>
                    <span className="text-text-primary font-medium">
                      {device.customer?.name || device.customerName || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Device</span>
                    <span className="text-text-primary">
                      {device.brand?.name} {device.model?.name}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <Link to={ROUTES.DEVICE_DETAIL(device.id)}>
                      <Button variant="outline" size="sm" className="w-full border-border">
                        View Device Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}



