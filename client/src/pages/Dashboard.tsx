import { DashboardHeader } from "../components/DashboardHeader";
import { StatsGrid } from "../components/StatsGrid";
import { RecentDevices } from "../components/RecentDevices";
import { PendingTasks } from "../components/PendingTasks";

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

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentDevices />
          </div>
          <div>
            <PendingTasks />
          </div>
        </div>
      </div>
    </>
  );
}

