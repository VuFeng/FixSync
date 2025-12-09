import { useState } from "react";
import { Plus } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { RepairItemsList } from "../components/RepairItemsList";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

export default function RepairItems() {
  const [filters, setFilters] = useState({
    deviceId: "",
    service: "all",
  });

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              Repair Items
            </h1>
            <p className="text-text-secondary">
              Manage all repair services and parts
            </p>
          </div>

          <Link to={ROUTES.REPAIR_ITEMS_NEW}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Repair Item
            </Button>
          </Link>
        </div>

        <RepairItemsList filters={filters} onFiltersChange={setFilters} />
      </div>
    </>
  );
}
