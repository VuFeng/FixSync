import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";
import { useCreateWarranty, useUpdateWarranty } from "../hooks/useWarranties";
import { useDevices } from "../hooks/useDevices";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";
import { useToast } from "../hooks/useToast";
import type { WarrantyRequest } from "../types";

interface WarrantyFormProps {
  initialData?: Partial<WarrantyRequest> & { deviceId?: string };
  warrantyId?: string;
  mode: "create" | "edit";
}

export function WarrantyForm({
  initialData,
  warrantyId,
  mode,
}: WarrantyFormProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    deviceId: initialData?.deviceId || "",
    repairItemId: initialData?.repairItemId || "",
    warrantyMonths: initialData?.warrantyMonths?.toString() || "3",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const { data: devicesData } = useDevices(0, 100);
  const devices = devicesData?.content || [];
  const { data: device } = useDevice(formData.deviceId ? formData.deviceId : "");

  const { mutateAsync: createWarranty, isPending: isCreating } = useCreateWarranty();
  const { mutateAsync: updateWarranty, isPending: isUpdating } = useUpdateWarranty();

  const isPending = isCreating || isUpdating;


  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.deviceId) newErrors.deviceId = "Device is required";
    if (!formData.warrantyMonths || Number(formData.warrantyMonths) <= 0)
      newErrors.warrantyMonths = "Warranty months must be greater than 0";
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
      const payload: WarrantyRequest = {
        deviceId: formData.deviceId,
        repairItemId: formData.repairItemId || undefined,
        warrantyMonths: Number(formData.warrantyMonths),
      };

      if (mode === "create") {
        const result = await createWarranty(payload);
        toast.success("Warranty created successfully");
        navigate(ROUTES.WARRANTIES + `/${result.id}`);
      } else if (warrantyId) {
        await updateWarranty({ id: warrantyId, data: payload });
        toast.success("Warranty updated successfully");
        navigate(ROUTES.WARRANTIES + `/${warrantyId}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to ${mode} warranty`
      );
    }
  };

  const deviceOptions = devices.map((d) => ({
    id: d.id,
    label: `${d.customerName} - ${d.brand?.name} ${d.model?.name} (${d.customerPhone})`,
  }));

  const repairItems = device?.repairItems || [];

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
        </div>

        {/* Repair Item Selection (Optional) */}
        {formData.deviceId && repairItems.length > 0 && (
          <div>
            <Label className="text-text-secondary mb-2 block">
              Link to Repair Item (Optional)
            </Label>
            <Select
              value={formData.repairItemId}
              onValueChange={(v) => handleSelectChange("repairItemId", v)}
              disabled={isPending}
            >
              <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                <SelectValue placeholder="Select a repair item (optional)">
                  {formData.repairItemId
                    ? repairItems.find((r) => r.id === formData.repairItemId)?.serviceName || ""
                    : "None (Device warranty)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-surface-secondary border-border max-h-72 overflow-auto">
                <SelectItem value="">None (Device warranty)</SelectItem>
                {repairItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.serviceName} - {item.cost ? `₫${item.cost.toLocaleString()}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-text-tertiary text-sm mt-1">
              Leave empty for device warranty, or select a specific repair item
            </p>
          </div>
        )}

        {/* Warranty Period */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Warranty Period (Months) *
          </Label>
          <Select
            value={formData.warrantyMonths}
            onValueChange={(v) => handleSelectChange("warrantyMonths", v)}
            disabled={isPending}
          >
            <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-secondary border-border">
              <SelectItem value="1">1 Month</SelectItem>
              <SelectItem value="3">3 Months</SelectItem>
              <SelectItem value="6">6 Months</SelectItem>
              <SelectItem value="12">12 Months</SelectItem>
              <SelectItem value="18">18 Months</SelectItem>
              <SelectItem value="24">24 Months</SelectItem>
            </SelectContent>
          </Select>
          {errors.warrantyMonths && (
            <p className="text-danger text-sm mt-1">{errors.warrantyMonths}</p>
          )}
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
              ? "Create Warranty"
              : "Update Warranty"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-border text-text-secondary hover:bg-surface-secondary bg-transparent"
            onClick={() => {
              if (mode === "edit" && warrantyId) {
                navigate(ROUTES.WARRANTIES + `/${warrantyId}`);
              } else if (formData.deviceId) {
                navigate(ROUTES.DEVICE_DETAIL(formData.deviceId));
              } else {
                navigate(ROUTES.WARRANTIES);
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

