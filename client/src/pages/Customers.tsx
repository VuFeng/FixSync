import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, User, Search } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { useCustomers, useDeleteCustomer } from "../hooks/useCustomers";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "../components/ui/Dialog";
import { SkeletonTable } from "../components/ui/Skeleton";
import { formatDate } from "../utils/format";
import { ROUTES } from "../constants";
import { EmptyState } from "../components/EmptyState";
import { Breadcrumb } from "../components/Breadcrumb";

export default function Customers() {
  const toast = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const { data, isLoading, error } = useCustomers(page, 20, "name", "ASC", search || undefined);
  const { mutateAsync: deleteCustomer, isPending: deletePending } = useDeleteCustomer();

  const customers = data?.content || [];

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCustomer(deleteConfirmId);
      toast.success("Customer deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete customer"
      );
    }
  };

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <Breadcrumb items={[{ label: "Customers" }]} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-3 rounded-lg">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Customers</h1>
              <p className="text-text-secondary">Manage customer information</p>
            </div>
          </div>
          <Link to={ROUTES.CUSTOMERS + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Customer
            </Button>
          </Link>
        </div>

        <Card className="bg-surface border-border p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              type="text"
              placeholder="Search customers by name or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10"
            />
          </div>
        </Card>

        <Card className="bg-surface border-border overflow-hidden">
          {isLoading ? (
            <div className="p-8">
              <SkeletonTable rows={5} cols={6} />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-danger">
              Error loading customers. Please try again.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-text-secondary">Name</TableHead>
                  <TableHead className="text-text-secondary">Phone</TableHead>
                  <TableHead className="text-text-secondary">Email</TableHead>
                  <TableHead className="text-text-secondary">Address</TableHead>
                  <TableHead className="text-text-secondary">Created</TableHead>
                  <TableHead className="text-text-secondary">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <div className="py-12">
                        <EmptyState
                          icon={User}
                          title="No customers found"
                          description="Get started by adding your first customer"
                          action={{
                            label: "Add Customer",
                            onClick: () => (window.location.href = ROUTES.CUSTOMERS + "/new"),
                          }}
                          className="border-0 shadow-none"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      className="border-border hover:bg-surface-secondary/50"
                    >
                      <TableCell className="text-text-primary font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell className="text-text-secondary font-mono text-sm">
                        {customer.phone}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {customer.email || "—"}
                      </TableCell>
                      <TableCell className="text-text-secondary">
                        {customer.address || "—"}
                      </TableCell>
                      <TableCell className="text-text-secondary text-sm">
                        {formatDate(customer.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link to={ROUTES.CUSTOMERS + `/${customer.id}/edit`}>
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
                            onClick={() => setDeleteConfirmId(customer.id)}
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

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-sm">
              Showing {data.page * data.size + 1} to{" "}
              {Math.min((data.page + 1) * data.size, data.totalElements)} of{" "}
              {data.totalElements} customers
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
                onClick={() => setPage((p) => Math.min(data.totalPages - 1, p + 1))}
                disabled={page >= data.totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <ConfirmDialog
          open={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
          onConfirm={handleDelete}
          title="Delete Customer"
          message="Are you sure you want to delete this customer? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          isLoading={deletePending}
        />
      </div>
    </>
  );
}

