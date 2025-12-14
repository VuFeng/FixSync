import { useMemo, useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Button } from "./ui/Button";
import { useRepairItems } from "../hooks/useRepairItems";
import { useDevices } from "../hooks/useDevices";
import { formatCurrency, formatDate } from "../utils/format";
import { useDeleteRepairItem } from "../hooks/useRepairItemMutations";
import { useToast } from "../hooks/useToast";
import { ConfirmDialog } from "./ui/Dialog";
import { SkeletonCard } from "./ui/Skeleton";

interface RepairItemsListProps {
  filters: {
    deviceId: string;
    service: string;
  };
  onFiltersChange: (filters: RepairItemsListProps["filters"]) => void;
}

export function RepairItemsList({
  filters,
  onFiltersChange,
}: RepairItemsListProps) {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { mutateAsync: deleteRepairItem, isPending: deletePending } = useDeleteRepairItem();

  // Devices to map deviceId -> readable name
  const { data: devicesData } = useDevices(0, 100);
  const deviceMap = useMemo(() => {
    const map = new Map<string, string>();
    devicesData?.content.forEach((d) => {
      const nameParts = [
        d.brand?.name,
        d.model?.name,
        d.deviceType,
        d.customerName ? `(${d.customerName})` : null,
      ].filter(Boolean);
      map.set(d.id, nameParts.join(" "));
    });
    return map;
  }, [devicesData]);

  const { data, isLoading, error } = useRepairItems(
    filters.deviceId || null,
    0,
    50,
    "createdAt",
    "DESC"
  );

  const items = data?.content || [];

  const filteredItems = items
    .map((item) => ({
      ...item,
      deviceName: deviceMap.get(item.deviceId) || item.deviceId,
    }))
    .filter((item) => {
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matches =
          item.serviceName.toLowerCase().includes(searchLower) ||
          (item.partUsed || "").toLowerCase().includes(searchLower) ||
          (item.description || "").toLowerCase().includes(searchLower) ||
          (item.deviceName || "").toLowerCase().includes(searchLower);
        if (!matches) return false;
      }

      if (filters.service && filters.service !== "all") {
        if (item.serviceName !== filters.service) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "cost-high":
          return (b.cost || 0) - (a.cost || 0);
        case "cost-low":
          return (a.cost || 0) - (b.cost || 0);
        case "warranty":
          return (b.warrantyMonths || 0) - (a.warrantyMonths || 0);
        case "latest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

  const totalCost = filteredItems.reduce(
    (sum, item) => sum + (item.cost || 0),
    0
  );
  const avgCost =
    filteredItems.length > 0 ? Math.round(totalCost / filteredItems.length) : 0;
  const avgWarranty =
    filteredItems.length > 0
      ? Math.round(
          filteredItems.reduce(
            (sum, item) => sum + (item.warrantyMonths || 0),
            0
          ) / filteredItems.length
        )
      : 0;

  const handleDelete = async (id: string) => {
    try {
      await deleteRepairItem(id);
      toast.success("Repair item deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete repair item");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border p-12 text-center">
        <p className="text-danger">
          Error loading repair items. Please try again.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Select
          value={filters.deviceId}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, deviceId: value })
          }
        >
          <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
            <SelectValue placeholder="All devices">
              {filters.deviceId
                ? deviceMap.get(filters.deviceId) || "Unknown Device"
                : "All devices"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-auto">
            <SelectItem value="">All devices</SelectItem>
            {devicesData?.content.map((device) => (
              <SelectItem key={device.id} value={device.id}>
                {deviceMap.get(device.id) || "Unknown Device"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 w-4 h-4 text-text-tertiary pointer-events-none" />
          <Input
            placeholder="Search by service, device, or part..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface-secondary border-border text-text-primary"
          />
        </div>

        <Select
          value={filters.service}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, service: value })
          }
        >
          <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
            <SelectValue placeholder="Service Type">
              {filters.service && filters.service !== "all" ? filters.service : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            {Array.from(new Set(items.map((i) => i.serviceName))).map(
              (name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
            <SelectValue placeholder="Sort By">
              {sortBy === "latest" ? "Latest First" :
               sortBy === "oldest" ? "Oldest First" :
               sortBy === "cost-high" ? "Cost: High to Low" :
               sortBy === "cost-low" ? "Cost: Low to High" :
               sortBy === "warranty" ? "Longest Warranty" : ""}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="cost-high">Cost: High to Low</SelectItem>
            <SelectItem value="cost-low">Cost: Low to High</SelectItem>
            <SelectItem value="warranty">Longest Warranty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Repair Items Grid */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="bg-surface border-border p-12 text-center">
            <p className="text-text-secondary">No repair items found</p>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className="bg-surface border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {item.serviceName}
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm">
                      Device: {item.deviceName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-text-tertiary hover:text-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-text-tertiary hover:text-danger"
                      onClick={() => setDeleteConfirmId(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                      Part Used
                    </p>
                    <p className="text-text-primary">
                      {item.partUsed || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                      Description
                    </p>
                    <p className="text-text-primary">
                      {item.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-2">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                        Cost
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(item.cost || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">
                        Warranty
                      </p>
                      <p className="text-text-primary font-medium">
                        {item.warrantyMonths ?? 0} months
                      </p>
                    </div>
                  </div>
                  <p className="text-text-tertiary text-sm">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredItems.length > 0 && (
        <Card className="bg-surface border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-text-tertiary text-sm mb-1">Total Items</p>
              <p className="text-2xl font-bold text-text-primary">
                {filteredItems.length}
              </p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalCost)}
              </p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Average Cost</p>
              <p className="text-2xl font-bold text-text-primary">
                {formatCurrency(avgCost)}
              </p>
            </div>
            <div>
              <p className="text-text-tertiary text-sm mb-1">Avg Warranty</p>
              <p className="text-2xl font-bold text-text-primary">
                {avgWarranty} months
              </p>
            </div>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => deleteConfirmId && handleDelete(deleteConfirmId)}
        title="Delete Repair Item"
        message="Are you sure you want to delete this repair item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deletePending}
      />
    </div>
  );
}
