import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
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
import { useCreateDevice, useUpdateDevice, useDevice } from "../hooks/useDevices";
import { useCustomers } from "../hooks/useCustomers";
import { useToast } from "../hooks/useToast";
import { SkeletonTable } from "./ui/Skeleton";

const deviceSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  brandId: z.string().min(1, "Brand is required"),
  modelId: z.string().min(1, "Model is required"),
  imei: z.string().optional(),
  color: z.string().optional(),
  note: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

interface DeviceFormProps {
  deviceId?: string;
}

export function DeviceForm({ deviceId }: DeviceFormProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!deviceId;
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");

  const { data: device, isLoading: deviceLoading } = useDevice(deviceId || "");
  const { data: brandsData, isLoading: brandsLoading } = useActiveBrands();
  const { data: modelsData, isLoading: modelsLoading } =
    useDeviceModelsByBrand(selectedBrandId);
  const { data: customersData } = useCustomers(0, 200);
  const createDeviceMutation = useCreateDevice();
  const updateDeviceMutation = useUpdateDevice();

  const brands = brandsData || [];
  const models = Array.isArray(modelsData) ? modelsData : (modelsData?.content || []);
  const customers = customersData?.content || [];
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  
  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const query = customerSearchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );
  }, [customers, customerSearchQuery]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      customerId: "",
      customerName: "",
      customerPhone: "",
      brandId: "",
      modelId: "",
      imei: "",
      color: "",
      note: "",
    },
  });

  // Find selected brand and model for display
  const selectedBrand = brands.find((b) => b.id === selectedBrandId);
  const selectedModel = models.find((m) => m.id === watch("modelId"));

  // Load device data when editing
  useEffect(() => {
    if (device && isEdit) {
      setValue("customerId", device.customer?.id || "");
      setValue("customerName", device.customer?.name || device.customerName || "");
      setValue("customerPhone", device.customer?.phone || device.customerPhone || "");
      setValue("brandId", device.brand?.id || "");
      setValue("modelId", device.model?.id || "");
      setValue("imei", device.imei || "");
      setValue("color", device.color || "");
      setValue("note", device.note || "");
      setSelectedBrandId(device.brand?.id || "");
    }
  }, [device, isEdit, setValue]);

  // Update selectedBrandId when brandId changes
  useEffect(() => {
    const brandId = watch("brandId");
    if (brandId && brandId !== selectedBrandId) {
      setSelectedBrandId(brandId);
    }
  }, [watch("brandId"), selectedBrandId]);

  // Auto-fill customer name and phone when customer is selected
  useEffect(() => {
    const customerId = watch("customerId");
    if (customerId) {
      const selectedCustomer = customers.find((c) => c.id === customerId);
      if (selectedCustomer) {
        setValue("customerName", selectedCustomer.name);
        setValue("customerPhone", selectedCustomer.phone);
      }
    } else {
      // Clear customer name and phone if no customer selected
      if (!watch("customerName") && !watch("customerPhone")) {
        setValue("customerName", "");
        setValue("customerPhone", "");
      }
    }
  }, [watch("customerId"), customers, setValue, watch]);

  const onSubmit = async (data: DeviceFormData) => {
    try {
      const selectedModel = models.find((m) => m.id === data.modelId);
      const deviceData = {
        customerId: data.customerId?.trim() || undefined,
        customerName: data.customerName?.trim() || undefined,
        customerPhone: data.customerPhone?.trim() || undefined,
        deviceType: selectedModel?.deviceType,
        brandId: data.brandId,
        modelId: data.modelId,
        imei: data.imei || undefined,
        color: data.color || undefined,
        note: data.note || undefined,
      };

      if (isEdit && deviceId) {
        await updateDeviceMutation.mutateAsync({ id: deviceId, data: deviceData });
        toast.success("Device updated successfully");
      } else {
        await createDeviceMutation.mutateAsync(deviceData);
        toast.success("Device created successfully");
      }
      navigate(ROUTES.DEVICES);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to ${isEdit ? "update" : "create"} device`
      );
    }
  };

  if (isEdit && deviceLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <div className="p-8">
          <SkeletonTable rows={5} cols={2} />
        </div>
      </Card>
    );
  }

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
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Select Customer (Optional)
              </Label>
              <Select
                value={watch("customerId") || ""}
                onValueChange={(value) => {
                  setValue("customerId", value || undefined);
                  if (!value) {
                    setValue("customerName", "");
                    setValue("customerPhone", "");
                  }
                  setCustomerSearchQuery(""); // Clear search when selecting
                }}
              >
                <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                  <SelectValue placeholder="Chọn khách hàng hoặc để trống">
                    {watch("customerId") 
                      ? customers.find((c) => c.id === watch("customerId"))?.name || ""
                      : ""}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <div className="p-2 border-b border-border">
                    <Input
                      placeholder="Tìm kiếm theo tên, số điện thoại..."
                      value={customerSearchQuery}
                      onChange={(e) => {
                        e.stopPropagation();
                        setCustomerSearchQuery(e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-surface border-border text-text-primary text-sm"
                    />
                  </div>
                  <div className="max-h-60 overflow-auto">
                    <SelectItem value="">-- Không chọn --</SelectItem>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.phone}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-4 text-sm text-text-tertiary text-center">
                        Không tìm thấy khách hàng
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-text-tertiary mb-2">
                Hoặc nhập thông tin khách hàng thủ công:
              </p>
            </div>
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Customer Name
              </Label>
              <Input
                {...register("customerName")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="Nguyễn Văn A"
                disabled={!!watch("customerId")}
              />
              {errors.customerName && (
                <p className="text-danger text-xs mt-1">
                  {errors.customerName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Phone Number
              </Label>
              <Input
                {...register("customerPhone")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="0901234567"
                disabled={!!watch("customerId")}
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
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Brand *
              </Label>
              <Select
                value={watch("brandId")}
                onValueChange={(value) => {
                  setValue("brandId", value);
                  setSelectedBrandId(value);
                  setValue("modelId", ""); // Reset model when brand changes
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
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Model *
              </Label>
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
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                IMEI
              </Label>
              <Input
                {...register("imei")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="123456789012345"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Color
              </Label>
              <Input
                {...register("color")}
                className="bg-surface-secondary border-border text-text-primary"
                placeholder="Black, White, etc."
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="block text-sm font-medium text-text-secondary mb-2">
            Notes
          </Label>
          <Textarea
            {...register("note")}
            className="bg-surface-secondary border-border text-text-primary min-h-24"
            placeholder="Additional notes about the device or repair..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-border">
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
            disabled={createDeviceMutation.isPending || updateDeviceMutation.isPending}
          >
            {createDeviceMutation.isPending || updateDeviceMutation.isPending
              ? "Saving..."
              : isEdit
              ? "Update Device"
              : "Create Device"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

