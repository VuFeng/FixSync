import { Edit2, Trash2, MoreVertical, Eye, Smartphone, Search } from "lucide-react";
import { Card } from "./ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/Table";
import { formatDate } from "../utils/format";
import { ROUTES, PAGINATION } from "../constants";
import { useDevices, useDeleteDevice } from "../hooks/useDevices";
import { useState } from "react";
import { useToast } from "../hooks/useToast";
import { SkeletonTable } from "./ui/Skeleton";
import { ConfirmDialog } from "./ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/DropdownMenu";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";

interface DeviceListProps {
  filters: {
    search: string;
  };
}

export function DeviceList({ filters }: DeviceListProps) {
  const toast = useToast();
  const [page, setPage] = useState<number>(PAGINATION.DEFAULT_PAGE);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data, isLoading, error } = useDevices(
    page,
    PAGINATION.DEFAULT_SIZE,
    PAGINATION.DEFAULT_SORT_BY,
    PAGINATION.DEFAULT_SORT_DIR
  );
  const { mutateAsync: deleteDevice, isPending: deletePending } = useDeleteDevice();
  const canDelete = true;

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteDevice(deleteConfirmId);
      toast.success("Device deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete device"
      );
    }
  };

  const devices = data?.content || [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const filteredDevices = devices.filter((device) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        (device.customerName || "").toLowerCase().includes(searchLower) ||
        (device.customerPhone || "").toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
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
            <TableHead className="text-text-secondary">Created</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDevices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <div className="py-12">
                  <EmptyState
                    icon={filters.search ? Search : Smartphone}
                    title={filters.search ? "No devices found" : "No devices yet"}
                    description={
                      filters.search
                        ? "Try adjusting your search or filter criteria"
                        : "Get started by receiving your first device"
                    }
                    action={
                      !filters.search
                        ? {
                            label: "Receive Device",
                            onClick: () => (window.location.href = ROUTES.DEVICES + "/new"),
                          }
                        : undefined
                    }
                    className="border-0 shadow-none"
                  />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredDevices.map((device) => (
              <TableRow
                key={device.id}
                className="border-border hover:bg-surface-secondary/50"
              >
                <TableCell className="text-text-secondary">
                  {device.customer?.name || device.customerName || "N/A"}
                </TableCell>
                <TableCell className="text-text-primary font-mono text-xs">
                  {device.customer?.phone || device.customerPhone || "N/A"}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-text-primary font-medium">
                      {device.brand?.name || ""} {device.model?.name || ""}
                    </p>
                    <p className="text-xs text-text-tertiary">{device.color}</p>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {formatDate(device.createdAt)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = ROUTES.DEVICE_DETAIL(device.id);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          window.location.href = ROUTES.DEVICES + `/${device.id}/edit`;
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </div>
                      </DropdownMenuItem>
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="danger"
                            onClick={() => setDeleteConfirmId(device.id)}
                          >
                            <div className="flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </div>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalElements={data?.totalElements}
        pageSize={PAGINATION.DEFAULT_SIZE}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Device"
        message="Are you sure you want to delete this device? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePending}
      />
    </Card>
  );
}

