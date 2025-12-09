import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2 } from "lucide-react";
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
import { useBrands } from "../hooks/useBrands";
import { useDeleteBrand } from "../hooks/useBrandMutations";
import { useToast } from "../components/ui/Toaster";
import { ConfirmDialog } from "../components/ui/Dialog";
import { SkeletonTable } from "../components/ui/Skeleton";
import { formatDate } from "../utils/format";
import { ROUTES } from "../constants";

export default function Brands() {
  const toast = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { data, isLoading, error } = useBrands();
  const { mutateAsync: deleteBrand, isPending: deletePending } = useDeleteBrand();

  const brands = data?.content || [];

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteBrand(deleteConfirmId);
      toast.success("Brand deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete brand"
      );
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Brands</h1>
            <p className="text-text-secondary">Manage device brands</p>
          </div>
          <Link to={ROUTES.BRANDS + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Brand
            </Button>
          </Link>
        </div>

        <Card className="bg-surface border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <SkeletonTable rows={5} cols={5} />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-danger">
              Error loading brands. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-secondary">Name</TableHead>
                  <TableHead className="text-text-secondary">Logo</TableHead>
                  <TableHead className="text-text-secondary">Status</TableHead>
                  <TableHead className="text-text-secondary">Created</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-text-secondary"
                    >
                      No brands found
                    </TableCell>
                  </TableRow>
                ) : (
                  brands.map((brand) => (
                    <TableRow
                      key={brand.id}
                      className="border-border hover:bg-surface-secondary/50"
                    >
                      <TableCell className="text-text-primary font-medium">
                        {brand.name}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <span className="text-text-tertiary">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            brand.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {brand.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {formatDate(brand.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={ROUTES.BRANDS + `/${brand.id}/edit`}>
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
                            onClick={() => setDeleteConfirmId(brand.id)}
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
          title="Delete Brand"
          message="Are you sure you want to delete this brand? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deletePending}
        />
      </div>
    </>
  );
}


