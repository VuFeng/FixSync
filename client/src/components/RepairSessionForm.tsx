import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { ROUTES } from "../constants";
import { useCreateRepairSession, useUpdateRepairSession } from "../hooks/useRepairSessions";
import { useDevices } from "../hooks/useDevices";
import { useUsers } from "../hooks/useUsers";
import { DeviceStatus } from "../types";
import type { RepairSession } from "../types";

interface RepairSessionFormProps {
  initialData?: RepairSession;
  sessionId?: string;
  mode: "create" | "edit";
}

export function RepairSessionForm({
  initialData,
  sessionId,
  mode,
}: RepairSessionFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    deviceId: initialData?.deviceId || "",
    status: initialData?.status || DeviceStatus.RECEIVED,
    receivedDate: initialData?.receivedDate
      ? new Date(initialData.receivedDate).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    expectedReturnDate: initialData?.expectedReturnDate
      ? new Date(initialData.expectedReturnDate).toISOString().slice(0, 16)
      : "",
    note: initialData?.note || "",
    assignedTo: initialData?.assignedTo?.id || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const { mutateAsync: createSession, isPending: isCreating } = useCreateRepairSession();
  const { mutateAsync: updateSession, isPending: isUpdating } = useUpdateRepairSession();
  const isPending = isCreating || isUpdating;

  const { data: devicesData } = useDevices(0, 100);
  const devices = devicesData?.content || [];
  const { data: usersData } = useUsers(0, 100);
  const users = usersData?.content || [];

  const deviceOptions = useMemo(
    () =>
      devices.map((d) => ({
        id: d.id,
        label: [
          d.brand?.name,
          d.model?.name,
          d.deviceType,
          d.customer?.name || d.customerName ? `(${d.customer?.name || d.customerName})` : null,
        ]
          .filter(Boolean)
          .join(" "),
      })),
    [devices]
  );

  // Initialize form when initialData changes
  const initialDataId = initialData?.id;
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (initialData && (!isInitialized || initialDataId !== initialData?.id)) {
      setIsInitialized(true);
      setFormData({
        deviceId: initialData.deviceId,
        status: initialData.status,
        receivedDate: initialData.receivedDate
          ? new Date(initialData.receivedDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        expectedReturnDate: initialData.expectedReturnDate
          ? new Date(initialData.expectedReturnDate).toISOString().slice(0, 16)
          : "",
        note: initialData.note || "",
        assignedTo: initialData.assignedTo?.id || "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};
    if (!formData.deviceId) newErrors.deviceId = "Device is required";
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
        deviceId: formData.deviceId,
        status: formData.status,
        receivedDate: formData.receivedDate
          ? new Date(formData.receivedDate).toISOString()
          : undefined,
        expectedReturnDate: formData.expectedReturnDate
          ? new Date(formData.expectedReturnDate).toISOString()
          : undefined,
        note: formData.note.trim() || undefined,
        assignedTo: formData.assignedTo || undefined,
      };

      if (mode === "create") {
        await createSession(data);
        navigate(ROUTES.REPAIR_SESSIONS);
      } else if (sessionId) {
        await updateSession({ id: sessionId, data });
        navigate(ROUTES.REPAIR_SESSIONS);
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
            <Label htmlFor="deviceId">
              Device <span className="text-danger">*</span>
            </Label>
            <Select
              value={formData.deviceId}
              onValueChange={(value) => handleSelectChange("deviceId", value)}
            >
              <SelectTrigger className={errors.deviceId ? "border-danger" : ""}>
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {deviceOptions.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deviceId && (
              <p className="text-danger text-sm mt-1">{errors.deviceId}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value as DeviceStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DeviceStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="receivedDate">Received Date</Label>
            <Input
              id="receivedDate"
              name="receivedDate"
              type="datetime-local"
              value={formData.receivedDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
            <Input
              id="expectedReturnDate"
              name="expectedReturnDate"
              type="datetime-local"
              value={formData.expectedReturnDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => handleSelectChange("assignedTo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {users
                  .filter((u) => u.role === "TECHNICIAN" || u.role === "ADMIN")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="note">Note</Label>
          <Textarea
            id="note"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Additional notes about this repair session"
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
              ? "Create Session"
              : "Update Session"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(ROUTES.REPAIR_SESSIONS)}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

