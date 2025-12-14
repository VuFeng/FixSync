import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Smartphone } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import { useActiveBrands } from "../hooks/useBrands";
import { useDeviceModelsByBrand } from "../hooks/useDeviceModels";
import { useDeleteDeviceModel } from "../hooks/useDeviceModelMutations";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "../components/ui/Dialog";
import { SkeletonTable } from "../components/ui/Skeleton";
import { formatDate } from "../utils/format";
import { ROUTES } from "../constants";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";

export default function DeviceModels() {
  const toast = useToast();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data: brands = [] } = useActiveBrands();
  const { data: modelsData, isLoading, error } = useDeviceModelsByBrand(
    selectedBrandId || brands[0]?.id || ""
  );
  const { mutateAsync: deleteModel, isPending: deletePending } = useDeleteDeviceModel();

  // Handle both array and PageResponse types
  const models = Array.isArray(modelsData) 
    ? modelsData 
    : (modelsData?.content || []);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteModel(deleteConfirmId);
      toast.success("Device model deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete device model"
      );
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <Breadcrumb items={[{ label: "Device Models" }]} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Device Models</h1>
            <p className="text-text-secondary">Manage device models by brand</p>
          </div>
          <Link to={ROUTES.DEVICE_MODELS + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Model
            </Button>
          </Link>
        </div>

        <Card className="bg-surface border-border p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Filter by Brand
              </label>
              <Select
                value={selectedBrandId || brands[0]?.id || ""}
                onValueChange={setSelectedBrandId}
              >
                <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                  <SelectValue placeholder="Select a brand">
                    {selectedBrandId
                      ? brands.find((b) => b.id === selectedBrandId)?.name ||
                        brands[0]?.name ||
                        "Select a brand"
                      : brands[0]?.name || "Select a brand"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="bg-surface border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <SkeletonTable rows={5} cols={5} />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-danger">
              Error loading device models. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-secondary">Model Name</TableHead>
                  <TableHead className="text-text-secondary">Device Type</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Created</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="p-0">
                      <div className="py-12">
                        <EmptyState
                          icon={Smartphone}
                          title="No device models found"
                          description={
                            selectedBrandId
                              ? `No models found for ${brands.find((b) => b.id === selectedBrandId)?.name || "this brand"}. Add the first model to get started.`
                              : "Select a brand to view its device models"
                          }
                          action={
                            selectedBrandId
                              ? {
                                  label: "Add Model",
                                  onClick: () => (window.location.href = ROUTES.DEVICE_MODELS + "/new"),
                                }
                              : undefined
                          }
                          className="border-0 shadow-none"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  models.map((model) => (
                    <TableRow
                      key={model.id}
                      className="border-border hover:bg-surface-secondary/50"
                    >
                      <TableCell className="text-text-primary font-medium">
                        {model.name}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {model.deviceType}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            model.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {model.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {formatDate(model.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={ROUTES.DEVICE_MODELS + `/${model.id}/edit`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-text-tertiary hover:text-primary"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-text-tertiary hover:text-danger"
                            onClick={() => setDeleteConfirmId(model.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>

        <ConfirmDialog
          open={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
          title="Delete Device Model"
          message="Are you sure you want to delete this device model? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deletePending}
        />
      </div>
    </>
  );
}
