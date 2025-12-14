import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";
import { useDevices } from "../hooks/useDevices";
import { useCreateRepairItem } from "../hooks/useRepairItemMutations";
import { useActiveServices } from "../hooks/useServiceCatalog";
import { ROUTES } from "../constants";
import { useToast } from "../hooks/useToast";

interface FormState {
  deviceId: string;
  serviceId: string;
  partUsed: string;
  cost: string;
  warrantyMonths: string;
  description: string;
}

const initialState: FormState = {
  deviceId: "",
  serviceId: "",
  partUsed: "",
  cost: "",
  warrantyMonths: "0",
  description: "",
};

export function CreateRepairItemForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );

  const { data: devicesData } = useDevices(0, 100);
  const devices = devicesData?.content || [];
  const { data: servicesData } = useActiveServices();
  const services = servicesData || [];

  const deviceOptions = useMemo(
    () =>
      (devices || []).map((d) => ({
        id: d.id,
        label:
          [
            d.brand?.name,
            d.model?.name,
            d.deviceType,
            d.imei ? `IMEI: ${d.imei}` : null,
            d.customer?.name || d.customerName ? `(${d.customer?.name || d.customerName})` : null,
          ]
            .filter(Boolean)
            .join(" "),
      })),
    [devices]
  );

  const { mutateAsync, isPending } = useCreateRepairItem();

  // Reset errors when form data changes - handle in onChange handlers instead

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    if (!formData.deviceId) newErrors.deviceId = "Device is required";
    if (!formData.serviceId) newErrors.serviceId = "Service is required";
    if (!formData.cost || Number(formData.cost) < 0)
      newErrors.cost = "Cost must be >= 0";
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
      await mutateAsync({
        deviceId: formData.deviceId,
        serviceId: formData.serviceId || undefined,
        serviceName: "", // backend sẽ lấy theo serviceId
        partUsed: formData.partUsed.trim() || undefined,
        cost: Number(formData.cost),
        warrantyMonths: Number(formData.warrantyMonths) || 0,
        description: formData.description.trim() || undefined,
      });
      toast.success("Repair item created successfully");
      navigate(ROUTES.REPAIR_ITEMS);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create repair item");
    }
  };

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Device Selection */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Device Information
          </h3>
          <div>
            <Label className="text-text-secondary mb-2 block">
              Select Device *
            </Label>
            <Select
              value={formData.deviceId}
              onValueChange={(v) => handleSelectChange("deviceId", v)}
            >
              <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                <SelectValue placeholder="Select a device">
                  {deviceOptions.find((d) => d.id === formData.deviceId)?.label ??
                    ""}
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
        </div>

        {/* Service Details */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Service Details
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-text-secondary mb-2 block">
                Select Service
              </Label>
              <Select
                value={formData.serviceId}
                onValueChange={(v) => {
                  const svc = services.find((s) => s.id === v);
                  setFormData((prev) => ({
                    ...prev,
                    serviceId: v,
                    partUsed: svc?.defaultPartUsed || "",
                    cost: (svc?.baseCost ?? "").toString(),
                    warrantyMonths:
                      svc?.defaultWarrantyMonths?.toString() ??
                      prev.warrantyMonths,
                  }));
                }}
              >
                <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                  <SelectValue placeholder="Select a catalog service">
                    {formData.serviceId
                      ? services.find((s) => s.id === formData.serviceId)?.name || ""
                      : ""}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-surface-secondary border-border max-h-72 overflow-auto">
                  <SelectItem value="">Select service</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceId && (
                <p className="text-danger text-sm mt-1">{errors.serviceId}</p>
              )}
            </div>
            <div>
              <Label className="text-text-secondary mb-2 block">
                Part Used
              </Label>
              <Input
                name="partUsed"
                value={formData.partUsed}
                onChange={handleChange}
                placeholder="e.g., Original OLED Screen, OEM Battery"
                className="bg-surface-secondary border-border text-text-primary"
              />
            </div>
          </div>
        </div>

        {/* Cost & Warranty */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Cost & Warranty
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-text-secondary mb-2 block">
                Cost (VND) *
              </Label>
              <Input
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0"
                className="bg-surface-secondary border-border text-text-primary"
                min={0}
              />
              {errors.cost && (
                <p className="text-danger text-sm mt-1">{errors.cost}</p>
              )}
            </div>
            <div>
              <Label className="text-text-secondary mb-2 block">
                Warranty Period (Months)
              </Label>
              <Select
                value={formData.warrantyMonths}
                onValueChange={(v) => handleSelectChange("warrantyMonths", v)}
              >
                <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface-secondary border-border">
                  <SelectItem value="0">No Warranty</SelectItem>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Additional Information
          </h3>
          <div>
            <Label className="text-text-secondary mb-2 block">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any notes or details about this repair service..."
              className="bg-surface-secondary border-border text-text-primary min-h-24"
            />
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-blue-400 text-sm">
              All repair items are linked to a specific device. Make sure you select
              the correct device.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Repair Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-text-secondary hover:bg-surface-secondary bg-transparent"
              onClick={() => navigate(ROUTES.REPAIR_ITEMS)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}


