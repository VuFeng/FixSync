import { Search, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/Select";
import { useUsers } from "../hooks/useUsers";
import { PAGINATION } from "../constants";

interface Filters {
  search: string;
  status: string;
  technician: string;
}

interface DeviceFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function DeviceFilters({ filters, onFiltersChange }: DeviceFiltersProps) {
  const { data: usersData } = useUsers(
    PAGINATION.DEFAULT_PAGE,
    100,
    PAGINATION.DEFAULT_SORT_BY,
    PAGINATION.DEFAULT_SORT_DIR
  );

  const technicians = usersData?.content.filter(
    (u) => u.role === "TECHNICIAN" && u.isActive
  ) || [];

  const handleReset = () => {
    onFiltersChange({
      search: "",
      status: "all",
      technician: "all",
    });
  };

  return (
    <Card className="bg-surface border-border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
          <Input
            placeholder="Search by customer or phone..."
            className="pl-10 bg-surface-secondary border-border text-text-primary"
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(v) => onFiltersChange({ ...filters, status: v })}
        >
          <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="RECEIVED">Received</SelectItem>
            <SelectItem value="INSPECTING">Inspecting</SelectItem>
            <SelectItem value="WAITING_PARTS">Waiting Parts</SelectItem>
            <SelectItem value="REPAIRING">Repairing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="RETURNED">Returned</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.technician}
          onValueChange={(v) => onFiltersChange({ ...filters, technician: v })}
        >
          <SelectTrigger className="bg-surface-secondary border-border text-text-primary">
            <SelectValue placeholder="Technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technicians</SelectItem>
            {technicians.map((tech) => (
              <SelectItem key={tech.id} value={tech.id}>
                {tech.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="border-border hover:bg-surface-secondary text-text-secondary bg-transparent"
          onClick={handleReset}
        >
          <X className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </Card>
  );
}

