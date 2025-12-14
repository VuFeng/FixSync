import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Package } from "lucide-react";
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
import { useServiceCatalogs } from "../hooks/useServiceCatalog";
import { useDeleteServiceCatalog } from "../hooks/useServiceCatalogMutations";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "../components/ui/Dialog";
import { SkeletonTable } from "../components/ui/Skeleton";
import { formatCurrency } from "../utils/format";
import { ROUTES } from "../constants";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";

export default function ServiceCatalogPage() {
  const toast = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data, isLoading, error } = useServiceCatalogs(0, 100);
  const { mutateAsync: deleteCatalog, isPending: deletePending } =
    useDeleteServiceCatalog();

  const catalogs = data?.content || [];

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCatalog(deleteConfirmId);
      toast.success("Service catalog deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete service catalog"
      );
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <Breadcrumb items={[{ label: "Service Catalog" }]} />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Service Catalog
            </h1>
            <p className="text-text-secondary">
              Manage repair services and their default settings
            </p>
          </div>
          <Link to={ROUTES.SERVICE_CATALOG + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Service
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
              Error loading service catalog. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-secondary">Service Name</TableHead>
                  <TableHead className="text-text-secondary">Default Part</TableHead>
                  <TableHead className="text-text-secondary">Base Cost</TableHead>
                  <TableHead className="text-text-secondary">Warranty</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="py-12">
                        <EmptyState
                          icon={Package}
                          title="No services found"
                          description="Get started by adding your first service to the catalog"
                          action={{
                            label: "Add Service",
                            onClick: () => (window.location.href = ROUTES.SERVICE_CATALOG + "/new"),
                          }}
                          className="border-0 shadow-none"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  catalogs.map((catalog) => (
                    <TableRow
                      key={catalog.id}
                      className="border-border hover:bg-surface-secondary/50"
                    >
                      <TableCell className="text-text-primary font-medium">
                        {catalog.name}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {catalog.defaultPartUsed || "—"}
                      </TableCell>
                      <TableCell className="text-text-primary font-medium">
                        {formatCurrency(catalog.baseCost)}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {catalog.defaultWarrantyMonths
                          ? `${catalog.defaultWarrantyMonths} months`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            catalog.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {catalog.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link
                            to={ROUTES.SERVICE_CATALOG + `/${catalog.id}/edit`}
                          >
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
                            onClick={() => setDeleteConfirmId(catalog.id)}
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
          title="Delete Service Catalog"
          message="Are you sure you want to delete this service catalog entry? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deletePending}
        />
      </div>
    </>
  );
}



