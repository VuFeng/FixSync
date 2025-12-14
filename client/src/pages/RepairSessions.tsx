import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Wrench } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Badge } from "../components/ui/Badge";
import { useRepairSessions } from "../hooks/useRepairSessions";
import { SkeletonTable } from "../components/ui/Skeleton";
import { formatDateTime } from "../utils/format";
import { ROUTES } from "../constants";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";
import { DeviceStatus } from "../types";

const statusColors: Record<DeviceStatus, string> = {
  RECEIVED: "bg-blue-500/20 text-blue-300",
  INSPECTING: "bg-yellow-500/20 text-yellow-300",
  WAITING_PARTS: "bg-orange-500/20 text-orange-300",
  REPAIRING: "bg-purple-500/20 text-purple-300",
  COMPLETED: "bg-emerald-500/20 text-emerald-300",
  RETURNED: "bg-green-500/20 text-green-300",
};

export default function RepairSessions() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useRepairSessions(page, 20);

  const sessions = data?.content || [];

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <Breadcrumb items={[{ label: "Repair Sessions" }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-lg">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">
                Repair Sessions
              </h1>
              <p className="text-text-secondary">
                Manage repair sessions for devices
              </p>
            </div>
          </div>
          <Link to={ROUTES.REPAIR_SESSION_NEW}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </Link>
        </div>

        <Card className="bg-surface border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <SkeletonTable rows={5} cols={6} />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-danger">
              Error loading repair sessions. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-secondary">Device</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">
                    Received Date
                  </TableHead>
                  <TableHead className="text-text-secondary">
                    Expected Return
                  </TableHead>
                  <TableHead className="text-text-secondary">
                    Assigned To
                  </TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="py-12">
                        <EmptyState
                          icon={Wrench}
                          title="No repair sessions found"
                          description="Get started by creating your first repair session"
                          action={{
                            label: "Create Session",
                            onClick: () =>
                              (window.location.href =
                                ROUTES.REPAIR_SESSION_NEW),
                          }}
                          className="border-0 shadow-none"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((session) => (
                    <TableRow
                      key={session.id}
                      className="border-border hover:bg-surface-secondary/50"
                    >
                      <TableCell className="text-text-primary font-medium">
                        <Link
                          to={ROUTES.DEVICE_DETAIL(session.deviceId)}
                          className="hover:text-primary"
                        >
                          {session.device
                            ? `${session.device.brand?.name || ""} ${
                                session.device.model?.name || ""
                              }`.trim() ||
                              session.device.customer?.name ||
                              session.device.customerName ||
                              `Device #${session.deviceId.slice(0, 8)}`
                            : `Device #${session.deviceId.slice(0, 8)}`}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[session.status] || ""}>
                          {session.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {formatDateTime(session.receivedDate)}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {session.expectedReturnDate
                          ? formatDateTime(session.expectedReturnDate)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {session.assignedTo?.fullName || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={ROUTES.REPAIR_SESSION_DETAIL(session.id)}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-text-tertiary hover:text-primary"
                            >
                              View
                            </Button>
                          </Link>
                          <Link to={ROUTES.REPAIR_SESSION_EDIT(session.id)}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-text-tertiary hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-sm">
              Showing {data.page * data.size + 1} to{" "}
              {Math.min((data.page + 1) * data.size, data.totalElements)} of{" "}
              {data.totalElements} sessions
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(data.totalPages - 1, p + 1))
                }
                disabled={page >= data.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
