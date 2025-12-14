import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select";
import { useCreateDeviceModel, useUpdateDeviceModel } from "../hooks/useDeviceModelMutations";
import { useDeviceModel } from "../hooks/useDeviceModels";
import { useActiveBrands } from "../hooks/useBrands";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../constants";

const deviceModelSchema = z.object({
  brandId: z.string().min(1, "Brand is required"),
  name: z.string().min(1, "Model name is required"),
  deviceType: z.string().min(1, "Device type is required"),
  isActive: z.boolean(),
});

type DeviceModelFormData = z.infer<typeof deviceModelSchema>;

const DEVICE_TYPES = [
  "Smartphone",
  "Tablet",
  "Laptop",
  "Smartwatch",
  "Earbuds",
  "Other",
];

export function DeviceModelForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const modelId = params.id;
  const isEdit = !!modelId;

  const { data: model, isLoading: modelLoading } = useDeviceModel(modelId || "");
  const { data: brands = [] } = useActiveBrands();
  const createMutation = useCreateDeviceModel();
  const updateMutation = useUpdateDeviceModel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DeviceModelFormData>({
    resolver: zodResolver(deviceModelSchema),
    defaultValues: {
      brandId: "",
      name: "",
      deviceType: "",
      isActive: true,
    },
  });

  // Load model data when editing
  useEffect(() => {
    if (model && isEdit) {
      setValue("brandId", model.brandId);
      setValue("name", model.name);
      setValue("deviceType", model.deviceType);
      setValue("isActive", model.isActive ?? true);
    }
  }, [model, isEdit, setValue]);

  const onSubmit = async (data: DeviceModelFormData) => {
    try {
      const modelData = {
        name: data.name,
        deviceType: data.deviceType,
        isActive: data.isActive,
      };

      if (isEdit && modelId) {
        await updateMutation.mutateAsync({ id: modelId, data: modelData });
        toast.success("Device model updated successfully");
      } else {
        await createMutation.mutateAsync({ brandId: data.brandId, data: modelData });
        toast.success("Device model created successfully");
      }
      navigate(ROUTES.DEVICE_MODELS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save device model"
      );
    }
  };

  if (isEdit && modelLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading device model...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!isEdit && (
          <div>
            <Label className="text-text-secondary mb-2 block">
              Brand *
            </Label>
            <Select
              value={watch("brandId")}
              onValueChange={(value) => setValue("brandId", value)}
            >
              <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
                <SelectValue placeholder="Select a brand" />
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
              <p className="text-danger text-xs mt-1">{errors.brandId.message}</p>
            )}
          </div>
        )}

        {isEdit && model && (
          <div>
            <Label className="text-text-secondary mb-2 block">Brand</Label>
            <Input
              value={model.brandName}
              disabled
              className="bg-surface-secondary border-border text-text-secondary"
            />
          </div>
        )}

        <div>
          <Label className="text-text-secondary mb-2 block">
            Model Name *
          </Label>
          <Input
            {...register("name")}
            className="bg-surface-secondary border-border text-text-primary"
            placeholder="e.g., iPhone 14 Pro, Galaxy S23"
          />
          {errors.name && (
            <p className="text-danger text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-text-secondary mb-2 block">
            Device Type *
          </Label>
          <Select
            value={watch("deviceType")}
            onValueChange={(value) => setValue("deviceType", value)}
          >
            <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              {DEVICE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.deviceType && (
            <p className="text-danger text-xs mt-1">{errors.deviceType.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="w-4 h-4 rounded border-border bg-surface-secondary text-primary"
          />
          <Label htmlFor="isActive" className="text-text-secondary">
            Active
          </Label>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.DEVICE_MODELS)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEdit
              ? "Update Model"
              : "Create Model"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
