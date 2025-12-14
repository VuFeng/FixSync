import { DashboardHeader } from "../components/DashboardHeader";
import { StatsGrid } from "../components/StatsGrid";
import { RecentDevices } from "../components/RecentDevices";
import { DeviceAlerts } from "../components/DeviceAlerts";
import { Button } from "../components/ui/Button";
import { Plus, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants";

export default function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-text-secondary">
            Welcome back! Here's your repair shop overview.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={ROUTES.DEVICES + "/new"}>
            <Button className="bg-primary hover:bg-primary-dark">
              <Plus className="w-4 h-4 mr-2" />
              Receive Device
            </Button>
          </Link>
          <Link to={ROUTES.REPAIR_ITEMS_NEW}>
            <Button variant="outline" className="border-border">
              <Wrench className="w-4 h-4 mr-2" />
              New Repair Item
            </Button>
          </Link>
          <Link to={ROUTES.SERVICE_CATALOG}>
            <Button
              variant="ghost"
              className="text-text-secondary hover:text-primary"
            >
              <Package className="w-4 h-4 mr-2" />
              Service Catalog
            </Button>
          </Link>
        </div>

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <RecentDevices />
          </div>
          <div>
            <DeviceAlerts />
          </div>
        </div>
      </div>
    </>
  );
}
