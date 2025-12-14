import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import { ROUTES } from "../constants";
import { useCreateCustomer, useUpdateCustomer } from "../hooks/useCustomers";
import type { Customer } from "../types";

interface CustomerFormProps {
  initialData?: Customer;
  customerId?: string;
  mode: "create" | "edit";
}

export function CustomerForm({ initialData, customerId, mode }: CustomerFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    note: initialData?.note || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const { mutateAsync: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const isPending = isCreating || isUpdating;

  // Initialize form when initialData changes
  const initialDataId = initialData?.id;
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (initialData && (!isInitialized || initialDataId !== initialData?.id)) {
      setIsInitialized(true);
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email || "",
        address: initialData.address || "",
        note: initialData.note || "",
      });
    }
  }, [initialDataId, initialData, isInitialized]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "Invalid email format";
    }
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
      const data = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
        note: formData.note.trim() || undefined,
      };

      if (mode === "create") {
        await createCustomer(data);
        navigate(ROUTES.CUSTOMERS);
      } else if (customerId) {
        await updateCustomer({ id: customerId, data });
        navigate(ROUTES.CUSTOMERS);
      }
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">
              Name <span className="text-danger">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Customer name"
              className={errors.name ? "border-danger" : ""}
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">
              Phone <span className="text-danger">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className={errors.phone ? "border-danger" : ""}
            />
            {errors.phone && (
              <p className="text-danger text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={errors.email ? "border-danger" : ""}
            />
            {errors.email && (
              <p className="text-danger text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Customer address"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Additional notes about the customer"
            rows={4}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary-dark"
            disabled={isPending}
          >
            {isPending
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Customer"
              : "Update Customer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.CUSTOMERS)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

