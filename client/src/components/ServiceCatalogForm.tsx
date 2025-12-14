import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import {
  useCreateServiceCatalog,
  useUpdateServiceCatalog,
} from "../hooks/useServiceCatalogMutations";
import { useServiceCatalog } from "../hooks/useServiceCatalog";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../constants";

const serviceCatalogSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  defaultPartUsed: z.string().optional(),
  baseCost: z.number().min(0, "Base cost must be >= 0"),
  defaultWarrantyMonths: z.number().min(0).optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type ServiceCatalogFormData = z.infer<typeof serviceCatalogSchema>;

export function ServiceCatalogForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const catalogId = params.id;
  const isEdit = !!catalogId;

  const { data: catalog, isLoading: catalogLoading } = useServiceCatalog(
    catalogId || ""
  );
  const createMutation = useCreateServiceCatalog();
  const updateMutation = useUpdateServiceCatalog();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ServiceCatalogFormData>({
    resolver: zodResolver(serviceCatalogSchema),
    defaultValues: {
      name: "",
      defaultPartUsed: "",
      baseCost: 0,
      defaultWarrantyMonths: 0,
      description: "",
      isActive: true,
    },
  });

  // Load catalog data when editing
  useEffect(() => {
    if (catalog && isEdit) {
      setValue("name", catalog.name);
      setValue("defaultPartUsed", catalog.defaultPartUsed || "");
      setValue("baseCost", catalog.baseCost);
      setValue("defaultWarrantyMonths", catalog.defaultWarrantyMonths || 0);
      setValue("description", catalog.description || "");
      setValue("isActive", catalog.isActive ?? true);
    }
  }, [catalog, isEdit, setValue]);

  const onSubmit = async (data: ServiceCatalogFormData) => {
    try {
      const catalogData = {
        name: data.name,
        defaultPartUsed: data.defaultPartUsed || undefined,
        baseCost: data.baseCost,
        defaultWarrantyMonths: data.defaultWarrantyMonths || undefined,
        description: data.description || undefined,
        isActive: data.isActive,
      };

      if (isEdit && catalogId) {
        await updateMutation.mutateAsync({ id: catalogId, data: catalogData });
        toast.success("Service catalog updated successfully");
      } else {
        await createMutation.mutateAsync(catalogData);
        toast.success("Service catalog created successfully");
      }
      navigate(ROUTES.SERVICE_CATALOG);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save service catalog"
      );
    }
  };

  if (isEdit && catalogLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading service catalog...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label className="text-text-secondary mb-2 block">
            Service Name *
          </Label>
          <Input
            {...register("name")}
            className="bg-surface-secondary border-border text-text-primary"
            placeholder="e.g., Screen Replacement, Battery Replacement"
          />
          {errors.name && (
            <p className="text-danger text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-text-secondary mb-2 block">
            Default Part Used
          </Label>
          <Input
            {...register("defaultPartUsed")}
            className="bg-surface-secondary border-border text-text-primary"
            placeholder="e.g., Original OLED Screen, OEM Battery"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-text-secondary mb-2 block">
              Base Cost (VND) *
            </Label>
            <Input
              {...register("baseCost", { valueAsNumber: true })}
              type="number"
              min="0"
              className="bg-surface-secondary border-border text-text-primary"
              placeholder="0"
            />
            {errors.baseCost && (
              <p className="text-danger text-xs mt-1">
                {errors.baseCost.message}
              </p>
            )}
          </div>

          <div>
            <Label className="text-text-secondary mb-2 block">
              Default Warranty (Months)
            </Label>
            <Input
              {...register("defaultWarrantyMonths", { valueAsNumber: true })}
              type="number"
              min="0"
              className="bg-surface-secondary border-border text-text-primary"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <Label className="text-text-secondary mb-2 block">Description</Label>
          <Textarea
            {...register("description")}
            className="bg-surface-secondary border-border text-text-primary min-h-24"
            placeholder="Add description about this service..."
          />
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
            onClick={() => navigate(ROUTES.SERVICE_CATALOG)}
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
              ? "Update Service"
              : "Create Service"}
          </Button>
        </div>
      </form>
    </Card>
  );
}



