import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { useCreateBrand, useUpdateBrand } from "../hooks/useBrandMutations";
import { useBrand } from "../hooks/useBrands";
import { useToast } from "./ui/Toaster";
import { ROUTES } from "../constants";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  isActive: z.boolean(),
});

type BrandFormData = z.infer<typeof brandSchema>;

export function BrandForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const params = useParams();
  const brandId = params.id;
  const isEdit = !!brandId;

  const { data: brand, isLoading: brandLoading } = useBrand(brandId || "");
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      isActive: true,
    },
  });

  // Load brand data when editing
  useEffect(() => {
    if (brand && isEdit) {
      setValue("name", brand.name);
      setValue("logoUrl", brand.logoUrl || "");
      setValue("isActive", brand.isActive ?? true);
    }
  }, [brand, isEdit, setValue]);

  const onSubmit = async (data: BrandFormData) => {
    try {
      const brandData = {
        name: data.name,
        logoUrl: data.logoUrl || undefined,
        isActive: data.isActive,
      };

      if (isEdit && brandId) {
        await updateMutation.mutateAsync({ id: brandId, data: brandData });
        toast.success("Brand updated successfully");
      } else {
        await createMutation.mutateAsync(brandData);
        toast.success("Brand created successfully");
      }
      navigate(ROUTES.BRANDS);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save brand"
      );
    }
  };

  if (isEdit && brandLoading) {
    return (
      <Card className="bg-surface border-border p-6">
        <p className="text-text-secondary">Loading brand...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label className="text-text-secondary mb-2 block">
            Brand Name *
          </Label>
          <Input
            {...register("name")}
            className="bg-surface-secondary border-border text-text-primary"
            placeholder="e.g., Apple, Samsung, Xiaomi"
          />
          {errors.name && (
            <p className="text-danger text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-text-secondary mb-2 block">Logo URL</Label>
          <Input
            {...register("logoUrl")}
            type="url"
            className="bg-surface-secondary border-border text-text-primary"
            placeholder="https://example.com/logo.png"
          />
          {errors.logoUrl && (
            <p className="text-danger text-xs mt-1">{errors.logoUrl.message}</p>
          )}
          {watch("logoUrl") && (
            <div className="mt-2">
              <img
                src={watch("logoUrl")}
                alt="Logo preview"
                className="w-16 h-16 object-contain border border-border rounded"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
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
            onClick={() => navigate(ROUTES.BRANDS)}
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
              ? "Update Brand"
              : "Create Brand"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

