import { Plus, Trash2, Receipt } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { useRepairItems } from "../hooks/useRepairItems";
import { formatCurrency, formatDate } from "../utils/format";
import { SkeletonCard } from "./ui/Skeleton";
import type { RepairItem, Transaction } from "../types";
import { Dialog } from "./ui/Dialog";
import { Input } from "./ui/Input";
import { useState, useMemo } from "react";
import { useCreateTransaction } from "../hooks/useTransactions";
import { useToast } from "../hooks/useToast";
import { PaymentMethod } from "../types";

interface Props {
  deviceId: string;
  itemsFromDevice?: RepairItem[];
  subtotalFromDevice?: number;
  transaction?: Transaction;
}

export function DeviceRepairItems({
  deviceId,
  itemsFromDevice,
  subtotalFromDevice,
  transaction,
}: Props) {
  const toast = useToast();
  const createTx = useCreateTransaction();

  const { data, isLoading, error } = useRepairItems(
    !itemsFromDevice ? deviceId : null,
    0,
    50
  );
  const items = itemsFromDevice ?? data?.content ?? [];
  const total = subtotalFromDevice ?? items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const finalPaid = transaction?.finalAmount || 0;
  const outstanding = Math.max(0, total - finalPaid);

  const [openModal, setOpenModal] = useState(false);
  const [totalInput, setTotalInput] = useState<number>(total);
  const [discountInput, setDiscountInput] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);

  const finalAmountPreview = useMemo(
    () => Math.max(0, (totalInput || 0) - (discountInput || 0)),
    [totalInput, discountInput]
  );

  const handleOpenModal = () => {
    setTotalInput(total);
    setDiscountInput(0);
    setPaymentMethod(PaymentMethod.CASH);
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!deviceId) return;
    try {
      await createTx.mutateAsync({
        deviceId,
        total: Math.max(0, totalInput || 0),
        discount: Math.max(0, discountInput || 0),
        paymentMethod,
      });
      toast.success("Tạo hóa đơn thành công");
      setOpenModal(false);
    } catch {
      toast.error("Tạo hóa đơn thất bại, vui lòng thử lại");
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <SkeletonCard />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-danger">Error loading repair items.</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Repair Services
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-border text-text-secondary">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary-dark"
            onClick={handleOpenModal}
            disabled={items.length === 0}
          >
            <Receipt className="w-4 h-4 mr-2" />
            {transaction ? "Update Transaction" : "Create Transaction"}
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.length === 0 ? (
          <p className="text-text-secondary text-sm">No repair items.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-surface-secondary p-4 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <p className="text-text-primary font-medium">
                    {item.serviceName}
                  </p>
                  <p className="text-text-tertiary text-sm">
                    {item.partUsed || "No part specified"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-text-tertiary hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {formatCurrency(item.cost || 0)}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {item.warrantyMonths || 0} months warranty
                  </Badge>
                </div>
                <span className="text-text-tertiary text-xs">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <p className="text-text-tertiary text-sm">Subtotal</p>
              <p className="text-xl font-bold text-text-primary">
                {formatCurrency(total)}
              </p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Paid</p>
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(finalPaid)}
              </p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm">Outstanding</p>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(outstanding)}
              </p>
            </div>
          </div>
        </div>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)} title="Create Transaction">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-1">Subtotal (từ dịch vụ)</p>
            <div className="text-lg font-semibold text-text-primary">
              {formatCurrency(total)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Total</p>
              <Input
                type="number"
                value={totalInput}
                onChange={(e) => setTotalInput(Number(e.target.value))}
                className="bg-surface-secondary border-border text-text-primary"
              />
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Discount</p>
              <Input
                type="number"
                value={discountInput}
                onChange={(e) => setDiscountInput(Number(e.target.value))}
                className="bg-surface-secondary border-border text-text-primary"
              />
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Payment Method</p>
            <div className="flex gap-2 flex-wrap">
              {Object.values(PaymentMethod).map((pm) => (
                <Button
                  key={pm}
                  type="button"
                  variant={paymentMethod === pm ? "default" : "outline"}
                  className={
                    paymentMethod === pm
                      ? "bg-primary hover:bg-primary-dark"
                      : "border-border text-text-secondary"
                  }
                  onClick={() => setPaymentMethod(pm)}
                  size="sm"
                >
                  {pm}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-surface-secondary border border-border flex justify-between items-center">
            <span className="text-text-secondary text-sm">Final amount</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(finalAmountPreview)}
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              className="border-border text-text-secondary"
              onClick={() => setOpenModal(false)}
              disabled={createTx.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary-dark"
              onClick={handleSubmit}
              disabled={createTx.isPending}
            >
              {createTx.isPending ? "Processing..." : "Save Transaction"}
            </Button>
          </div>
        </div>
      </Dialog>
    </Card>
  );
}



