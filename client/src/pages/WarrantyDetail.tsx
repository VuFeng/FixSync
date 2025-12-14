import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useWarranty, useDeleteWarranty } from "../hooks/useWarranties";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { formatDate, formatDateTime } from "../utils/format";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "../components/ui/Dialog";
import { useState } from "react";

export default function WarrantyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: warranty, isLoading, error } = useWarranty(id);
  const { data: device } = useDevice(warranty?.deviceId || "");
  const { mutateAsync: deleteWarranty, isPending: deletePending } = useDeleteWarranty();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteWarranty(id);
      toast.success("Warranty deleted successfully");
      navigate(ROUTES.WARRANTIES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete warranty");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const isExpired = warranty ? new Date(warranty.endDate) < new Date() : false;
  const isExpiringSoon =
    warranty
      ? new Date(warranty.endDate) > new Date() &&
        new Date(warranty.endDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : false;

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

  if (error || !warranty) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <Card className="bg-surface border-border p-6">
            <p className="text-danger">
              {error instanceof Error ? error.message : "Warranty not found"}
            </p>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to={ROUTES.WARRANTIES}>
            <Button
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Warranties
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link to={ROUTES.WARRANTIES + `/${id}/edit`}>
              <Button variant="outline" className="border-border">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-border text-danger hover:bg-red-500/10"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Warranty Details */}
            <Card className="bg-surface border-border p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Warranty Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Warranty Code</span>
                  <span className="text-text-primary font-mono font-semibold">
                    {warranty.warrantyCode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Start Date</span>
                  <span className="text-text-primary">{formatDateTime(warranty.startDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">End Date</span>
                  <span className="text-text-primary">{formatDateTime(warranty.endDate)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Status</span>
                  <Badge
                    className={
                      isExpired
                        ? "bg-red-500/20 text-red-400"
                        : isExpiringSoon
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }
                  >
                    {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Created</span>
                  <span className="text-text-primary">{formatDate(warranty.createdAt)}</span>
                </div>
              </div>
            </Card>

            {/* Device Information */}
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
                    <span className="text-text-secondary">Phone</span>
                    <span className="text-text-primary">
                      {device.customer?.phone || device.customerPhone || "N/A"}
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

          {/* Summary Card */}
          <div>
            <Card className="bg-surface border-border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Warranty Code</span>
                  <span className="text-text-primary font-mono text-xs">
                    {warranty.warrantyCode}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Status</span>
                  <Badge
                    className={
                      isExpired
                        ? "bg-red-500/20 text-red-400"
                        : isExpiringSoon
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }
                  >
                    {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
                  </Badge>
                </div>
                {warranty.repairItemId && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-text-secondary text-sm mb-1">Repair Item</p>
                    <p className="text-text-primary text-sm">Linked to repair item</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Warranty"
        message="Are you sure you want to delete this warranty? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePending}
      />
    </>
  );
}

