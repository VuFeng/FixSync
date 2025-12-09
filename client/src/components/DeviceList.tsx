import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/Table";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { formatDate } from "../utils/format";
import { ROUTES, PAGINATION } from "../constants";
import { useDevices, useUpdateDeviceStatus, useAssignDevice } from "../hooks/useDevices";
import { useUsers } from "../hooks/useUsers";
import { useAuthStore } from "../stores/auth.store";
import { DeviceStatus } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { useState } from "react";
import { useToast } from "./ui/Toaster";
import { SkeletonTable } from "./ui/Skeleton";

interface DeviceListProps {
  filters: {
    search: string;
    status: string;
    technician: string;
  };
}

const statusColors: Record<string, string> = {
  RECEIVED: "bg-blue-500/20 text-blue-400",
  INSPECTING: "bg-yellow-500/20 text-yellow-400",
  WAITING_PARTS: "bg-orange-500/20 text-orange-400",
  REPAIRING: "bg-purple-500/20 text-purple-400",
  COMPLETED: "bg-green-500/20 text-green-400",
  RETURNED: "bg-gray-500/20 text-gray-400",
};

export function DeviceList({ filters }: DeviceListProps) {
  const toast = useToast();
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE);
  const { data, isLoading, error } = useDevices(
    page,
    PAGINATION.DEFAULT_SIZE,
    PAGINATION.DEFAULT_SORT_BY,
    PAGINATION.DEFAULT_SORT_DIR
  );
  const { mutateAsync: updateStatus, isPending: statusPending } = useUpdateDeviceStatus();
  const { mutateAsync: assignDevice, isPending: assignPending } = useAssignDevice();
  const { data: usersData } = useUsers(0, 100);
  const technicians =
    usersData?.content.filter((u) => u.role === "TECHNICIAN" && u.isActive) || [];
  const { user } = useAuthStore();

  const canUpdateStatus = user?.role === "ADMIN" || user?.role === "TECHNICIAN";
  const canAssign = user?.role === "ADMIN";

  const devices = data?.content || [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const filteredDevices = devices.filter((device) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        device.customerName.toLowerCase().includes(searchLower) ||
        device.customerPhone.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.status && filters.status !== "all") {
      if (device.status !== filters.status) return false;
    }

    if (filters.technician && filters.technician !== "all") {
      if (device.assignedTo?.id !== filters.technician) return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8">
          <SkeletonTable rows={5} cols={7} />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8 text-center text-danger">
          Error loading devices. Please try again.
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-secondary">Customer</TableHead>
            <TableHead className="text-text-secondary">Phone</TableHead>
            <TableHead className="text-text-secondary">Device</TableHead>
            <TableHead className="text-text-secondary">Status</TableHead>
            <TableHead className="text-text-secondary">Assigned To</TableHead>
            <TableHead className="text-text-secondary">Received</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDevices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-text-secondary">
                No devices found
              </TableCell>
            </TableRow>
          ) : (
            filteredDevices.map((device) => (
              <TableRow
                key={device.id}
                className="border-border hover:bg-surface-secondary/50"
              >
                <TableCell className="text-text-secondary">
                  {device.customerName}
                </TableCell>
                <TableCell className="text-text-primary font-mono text-xs">
                  {device.customerPhone}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-text-primary font-medium">
                      {device.brand?.name} {device.model?.name}
                    </p>
                    <p className="text-xs text-text-tertiary">{device.color}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      statusColors[device.status] ||
                      "bg-gray-500/20 text-gray-400"
                    }
                  >
                    {device.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  <Select
                    value={device.assignedTo?.id || ""}
                    onValueChange={async (v) => {
                      try {
                        await assignDevice({ id: device.id, assignedToId: v });
                        toast.success("Technician assigned successfully");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to assign technician");
                      }
                    }}
                    disabled={assignPending || !canAssign}
                  >
                    <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                      <SelectValue placeholder="Assign technician">
                        {device.assignedTo?.fullName || "Unassigned"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-72 overflow-auto">
                      <SelectItem value="">Unassigned</SelectItem>
                      {technicians.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {formatDate(device.receivedDate)}
                </TableCell>
                <TableCell className="space-y-2">
                  <Select
                    value={device.status}
                    onValueChange={async (v) => {
                      try {
                        await updateStatus({ id: device.id, status: v });
                        toast.success("Device status updated successfully");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Failed to update status");
                      }
                    }}
                    disabled={statusPending || !canUpdateStatus}
                  >
                    <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DeviceStatus) as Array<keyof typeof DeviceStatus>).map((key) => (
                        <SelectItem key={key} value={DeviceStatus[key]}>
                          {DeviceStatus[key].replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Link to={ROUTES.DEVICE_DETAIL(device.id)}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:bg-primary/20"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <p className="text-text-secondary text-sm">
          Page {currentPage + 1} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-border"
            disabled={currentPage <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            className="border-border"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}

