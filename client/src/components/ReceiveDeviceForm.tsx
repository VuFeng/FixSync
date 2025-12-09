import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { ROUTES } from "../constants";
import { useActiveBrands } from "../hooks/useBrands";
import { useDeviceModelsByBrand } from "../hooks/useDeviceModels";
import { useCreateDevice } from "../hooks/useDevices";
import { DeviceStatus } from "../types";
import { useToast } from "./ui/Toaster";

const deviceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  brandId: z.string().min(1, "Brand is required"),
  modelId: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  color: z.string().optional(),
  receivedDate: z.string().min(1, "Received date is required"),
  expectedReturnDate: z.string().optional(),
  warrantyMonths: z.number().optional(),
  note: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export function ReceiveDeviceForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");

  const { data: brandsData, isLoading: brandsLoading } = useActiveBrands();
  const { data: modelsData, isLoading: modelsLoading } =
    useDeviceModelsByBrand(selectedBrandId);
  const createDeviceMutation = useCreateDevice();

  const brands = brandsData || [];
  const models = (modelsData as any[]) || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      receivedDate: new Date().toISOString().slice(0, 16),
    },
  });

  // Find selected brand and model names for display
  const selectedBrand = brands.find((b) => b.id === selectedBrandId);
  const selectedModelId = watch("modelId");
  const selectedModel = models.find((m) => m.id === selectedModelId);

  // Reset model when brand changes
  useEffect(() => {
    if (selectedBrandId) {
      setValue("modelId", "");
    }
  }, [selectedBrandId, setValue]);

  const onSubmit = async (data: DeviceFormData) => {
    try {
      // Convert form data to API format
      const deviceData = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        brandId: data.brandId,
        modelId: data.modelId,
        imei: data.imei || undefined,
        color: data.color || undefined,
        receivedDate: new Date(data.receivedDate).toISOString(),
        expectedReturnDate: data.expectedReturnDate
          ? new Date(data.expectedReturnDate).toISOString()
          : undefined,
        warrantyMonths: data.warrantyMonths || undefined,
        status: DeviceStatus.RECEIVED,
        note: data.note || undefined,
      };

      await createDeviceMutation.mutateAsync(deviceData);
      toast.success("Device created successfully");
      navigate(ROUTES.DEVICES);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create device");
    }
  };

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Customer Name *
              </label>
              <Input
                {...register("customerName")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="Nguyễn Văn A"
              />
              {errors.customerName && (
                <p className="text-danger text-xs mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number *
              </label>
              <Input
                {...register("customerPhone")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="0901234567"
              />
              {errors.customerPhone && (
                <p className="text-danger text-xs mt-1">
                  {errors.customerPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Device Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Brand *
              </label>
              <Select
                value={selectedBrandId}
                onValueChange={(value) => {
                  setSelectedBrandId(value);
                  setValue("brandId", value);
                }}
                disabled={brandsLoading}
              >
                <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                  <SelectValue
                    placeholder={brandsLoading ? "Loading..." : "Select brand"}
                  >
                    {selectedBrand ? selectedBrand.name : ""}
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
              {errors.brandId && (
                <p className="text-danger text-xs mt-1">
                  {errors.brandId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Model *
              </label>
              <div
                className={
                  !selectedBrandId ? "opacity-50 pointer-events-none" : ""
                }
              >
                <Select
                  value={watch("modelId")}
                  onValueChange={(value) => setValue("modelId", value)}
                  disabled={!selectedBrandId || modelsLoading}
                >
                  <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                    <SelectValue
                      placeholder={
                        !selectedBrandId
                          ? "Select brand first"
                          : modelsLoading
                          ? "Loading..."
                          : "Select model"
                      }
                    >
                      {selectedModel ? selectedModel.name : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.modelId && (
                <p className="text-danger text-xs mt-1">
                  {errors.modelId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                IMEI
              </label>
              <Input
                {...register("imei")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="123456789012345"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Color
              </label>
              <Input
                {...register("color")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="Black, White, etc."
              />
            </div>
          </div>
        </div>

        {/* Repair Information */}
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Repair Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Received Date *
              </label>
              <Input
                type="datetime-local"
                {...register("receivedDate")}
                className="bg-surface-secondary border-border text-text-primary"
              />
              {errors.receivedDate && (
                <p className="text-danger text-xs mt-1">
                  {errors.receivedDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Expected Return Date
              </label>
              <Input
                type="datetime-local"
                {...register("expectedReturnDate")}
                className="bg-surface-secondary border-border text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Warranty Months
              </label>
              <Input
                type="number"
                {...register("warrantyMonths", { valueAsNumber: true })}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="3"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Notes
            </label>
            <textarea
              {...register("note")}
              className="w-full min-h-[100px] rounded-md border bg-surface-secondary border-border px-3 py-2 text-text-primary"
              placeholder="Additional notes about the device..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.DEVICES)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark"
            disabled={createDeviceMutation.isPending}
          >
            {createDeviceMutation.isPending ? "Creating..." : "Create Device"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
