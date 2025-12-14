import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, Trash2, Printer } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useTransaction, useDeleteTransaction } from "../hooks/useTransactions";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { formatCurrency, formatDate, formatDateTime } from "../utils/format";
import { PaymentMethod } from "../types";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "../components/ui/Dialog";
import { useState } from "react";
import { printTransactionReceipt } from "../utils/print";

const methodMap: Record<PaymentMethod, string> = {
  CASH: "Cash",
  MOMO: "MoMo",
  BANKING: "Banking",
};

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: transaction, isLoading, error } = useTransaction(id);
  const { data: device } = useDevice(transaction?.deviceId || "");
  const { mutateAsync: deleteTransaction, isPending: deletePending } = useDeleteTransaction();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      navigate(ROUTES.TRANSACTIONS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete transaction");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

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

  if (error || !transaction) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <Card className="bg-surface border-border p-6">
            <p className="text-danger">
              {error instanceof Error ? error.message : "Transaction not found"}
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
          <Link to={ROUTES.TRANSACTIONS}>
            <Button
              variant="ghost"
              className="text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => {
                if (transaction && device) {
                  printTransactionReceipt(transaction, device);
                }
              }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
            <Link to={ROUTES.TRANSACTIONS + `/${id}/edit`}>
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
            {/* Transaction Details */}
            <Card className="bg-surface border-border p-6">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Transaction Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Transaction ID</span>
                  <span className="text-text-primary font-mono text-sm">{transaction.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Date</span>
                  <span className="text-text-primary">{formatDateTime(transaction.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Payment Method</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {methodMap[transaction.paymentMethod] || transaction.paymentMethod}
                  </Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary">{formatCurrency(transaction.total)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">Discount</span>
                  <span className="text-text-primary">{formatCurrency(transaction.discount)}</span>
                </div>
                <div className="flex justify-between items-center py-2 pt-4">
                  <span className="text-xl font-semibold text-text-primary">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(transaction.finalAmount)}
                  </span>
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
                  <span className="text-text-secondary">Status</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400">Paid</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Created</span>
                  <span className="text-text-primary">{formatDate(transaction.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePending}
      />
    </>
  );
}

