import { useState, useEffect } from "react";
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
import { ROUTES } from "../constants";
import { useToast } from "../hooks/useToast";
import { Role, type User } from "../types";
import { useCreateUser, useUpdateUser } from "../hooks/useUsers";

interface UserFormProps {
  initialData?: User;
  userId?: string;
  mode: "create" | "edit";
}

export function UserForm({ initialData, userId, mode }: UserFormProps) {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    role: initialData?.role || Role.RECEPTIONIST,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const isPending = isCreating || isUpdating;

  // Initialize form when initialData changes
  const initialDataId = initialData?.id;
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (initialData && (!isInitialized || initialDataId !== initialData?.id)) {
      setIsInitialized(true);
      setFormData({
        fullName: initialData.fullName,
        email: initialData.email,
        role: initialData.role,
        password: "",
        confirmPassword: "",
      });
    }
  }, [initialDataId, initialData, isInitialized]);

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
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (mode === "create" && !formData.password) {
      newErrors.password = "Password is required";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      if (mode === "create") {
        await createUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        toast.success("User created successfully");
        navigate(ROUTES.USERS);
      } else if (userId) {
        await updateUser({
          id: userId,
          data: {
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
          },
        });
        toast.success("User updated successfully");
        navigate(ROUTES.USERS);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : `Failed to ${mode} user`
      );
    }
  };

  return (
    <Card className="bg-surface border-border p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Full Name *
          </Label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="bg-surface-secondary border-border text-text-primary"
            disabled={isPending}
          />
          {errors.fullName && (
            <p className="text-danger text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Email *
          </Label>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
            className="bg-surface-secondary border-border text-text-primary"
            disabled={isPending || mode === "edit"}
          />
          {errors.email && (
            <p className="text-danger text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <Label className="text-text-secondary mb-2 block">
            Role *
          </Label>
          <Select
            value={formData.role}
            onValueChange={(v) => handleSelectChange("role", v)}
            disabled={isPending}
          >
            <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-surface-secondary border-border">
              <SelectItem value={Role.ADMIN}>Admin</SelectItem>
              <SelectItem value={Role.TECHNICIAN}>Technician</SelectItem>
              <SelectItem value={Role.RECEPTIONIST}>Receptionist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        {mode === "create" && (
          <>
            <div>
              <Label className="text-text-secondary mb-2 block">
                Password *
              </Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-surface-secondary border-border text-text-primary"
                disabled={isPending}
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label className="text-text-secondary mb-2 block">
                Confirm Password *
              </Label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-surface-secondary border-border text-text-primary"
                disabled={isPending}
              />
              {errors.confirmPassword && (
                <p className="text-danger text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </>
        )}

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
              ? "Create User"
              : "Update User"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-border text-text-secondary hover:bg-surface-secondary bg-transparent"
            onClick={() => navigate(ROUTES.USERS)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

