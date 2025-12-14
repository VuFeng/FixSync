import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";
import { useCreateTransaction, useUpdateTransaction } from "../hooks/useTransactions";
import { useDevices } from "../hooks/useDevices";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { useToast } from "../hooks/useToast";
import { PaymentMethod, type TransactionRequest } from "../types";
import { formatCurrency } from "../utils/format";

interface TransactionFormProps {
  initialData?: Partial<TransactionRequest> & { deviceId?: string };
  transactionId?: string;
  mode: "create" | "edit";
}

export function TransactionForm({
  initialData,
  transactionId,
  mode,
}: TransactionFormProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    deviceId: initialData?.deviceId || "",
    total: initialData?.total?.toString() || "",
    discount: initialData?.discount?.toString() || "0",
    paymentMethod: initialData?.paymentMethod || PaymentMethod.CASH,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const { data: devicesData } = useDevices(0, 100);
  const devices = devicesData?.content || [];
  const { data: device } = useDevice(formData.deviceId ? formData.deviceId : "");

  const { mutateAsync: createTransaction, isPending: isCreating } = useCreateTransaction();
  const { mutateAsync: updateTransaction, isPending: isUpdating } = useUpdateTransaction();

  const isPending = isCreating || isUpdating;

  // Auto-fill total from device repair items if creating and device has repair items
  const initialTotal = useMemo(() => {
    if (mode === "create" && device?.repairSubtotal !== undefined) {
      return device.repairSubtotal.toString();
    }
    return "";
  }, [mode, device?.repairSubtotal]);

  // Initialize form with total if creating
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (!isInitialized && initialTotal && !formData.total) {
      setIsInitialized(true);
      setFormData((prev) => ({
        ...prev,
        total: initialTotal,
      }));
    }
  }, [initialTotal, formData.total, isInitialized]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.deviceId) newErrors.deviceId = "Device is required";
    if (!formData.total || Number(formData.total) < 0)
      newErrors.total = "Total must be >= 0";
    if (!formData.discount || Number(formData.discount) < 0)
      newErrors.discount = "Discount must be >= 0";
    if (Number(formData.discount) > Number(formData.total))
      newErrors.discount = "Discount cannot exceed total";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload: TransactionRequest = {
        deviceId: formData.deviceId,
        total: Number(formData.total),
        discount: Number(formData.discount),
        paymentMethod: formData.paymentMethod as PaymentMethod,
      };

      if (mode === "create") {
        const result = await createTransaction(payload);
        toast.success("Transaction created successfully");
        navigate(ROUTES.TRANSACTION_DETAIL(result.id));
      } else if (transactionId) {
        await updateTransaction({ id: transactionId, data: payload });
        toast.success("Transaction updated successfully");
        navigate(ROUTES.TRANSACTION_DETAIL(transactionId));
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to ${mode} transaction`
      );
    }
  };

  const total = Number(formData.total) || 0;
  const discount = Number(formData.discount) || 0;
  const finalAmount = Math.max(0, total - discount);

  const deviceOptions = devices.map((d) => ({
    id: d.id,
    label: `${d.customerName} - ${d.brand?.name} ${d.model?.name} (${d.customerPhone})`,
  }));

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Device Selection */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Select Device *
          </Label>
          <Select
            value={formData.deviceId}
            onValueChange={(v) => handleSelectChange("deviceId", v)}
            disabled={isPending || mode === "edit"}
          >
            <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
              <SelectValue placeholder="Select a device">
                {deviceOptions.find((d) => d.id === formData.deviceId)?.label || ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-surface-secondary border-border max-h-72 overflow-auto">
              {deviceOptions.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deviceId && (
            <p className="text-danger text-sm mt-1">{errors.deviceId}</p>
          )}
          {device && device.repairSubtotal && mode === "create" && (
            <p className="text-blue-400 text-sm mt-1">
              Repair subtotal: {formatCurrency(device.repairSubtotal)}
            </p>
          )}
        </div>

        {/* Amount Details */}
        <div className="space-y-4">
          <div>
            <Label className="text-text-secondary mb-2 block">
              Total Amount (VND) *
            </Label>
            <Input
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              placeholder="0"
              className="bg-surface-secondary border-border text-text-primary"
              min={0}
              disabled={isPending}
            />
            {errors.total && (
              <p className="text-danger text-sm mt-1">{errors.total}</p>
            )}
          </div>

          <div>
            <Label className="text-text-secondary mb-2 block">
              Discount (VND) *
            </Label>
            <Input
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              className="bg-surface-secondary border-border text-text-primary"
              min={0}
              max={total}
              disabled={isPending}
            />
            {errors.discount && (
              <p className="text-danger text-sm mt-1">{errors.discount}</p>
            )}
          </div>

          <div className="bg-surface-secondary p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Subtotal</span>
              <span className="text-text-primary">{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Discount</span>
              <span className="text-text-primary">-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-lg font-semibold text-text-primary">Final Amount</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Payment Method *
          </Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(v) => handleSelectChange("paymentMethod", v)}
            disabled={isPending}
          >
            <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-secondary border-border">
              <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
              <SelectItem value={PaymentMethod.MOMO}>MoMo</SelectItem>
              <SelectItem value={PaymentMethod.BANKING}>Banking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            type="submit"
            className="flex-1 bg-primary hover:bg-primary-dark"
            disabled={isPending}
          >
            {isPending
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Transaction"
              : "Update Transaction"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-border text-text-secondary hover:bg-surface-secondary bg-transparent"
            onClick={() => {
              if (mode === "edit" && transactionId) {
                navigate(ROUTES.TRANSACTION_DETAIL(transactionId));
              } else if (formData.deviceId) {
                navigate(ROUTES.DEVICE_DETAIL(formData.deviceId));
              } else {
                navigate(ROUTES.TRANSACTIONS);
              }
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

