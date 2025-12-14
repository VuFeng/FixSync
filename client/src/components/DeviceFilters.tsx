import { Search, X } from "lucide-react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface Filters {
  search: string;
}

interface DeviceFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function DeviceFilters({ filters, onFiltersChange }: DeviceFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      search: "",
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

