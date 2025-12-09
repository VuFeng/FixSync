import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { DeviceFilters } from "../components/DeviceFilters";
import { DeviceList } from "../components/DeviceList";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../constants";

export default function Devices() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    technician: "all",
  });

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Devices</h1>
            <p className="text-text-secondary">Manage all repair devices</p>
          </div>
          <Link to={ROUTES.DEVICES + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              New Device
            </Button>
          </Link>
        </div>

        <DeviceFilters filters={filters} onFiltersChange={setFilters} />

        <DeviceList filters={filters} />
      </div>
    </>
  );
}



