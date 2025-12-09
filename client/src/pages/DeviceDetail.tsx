import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { DeviceDetailCard } from "../components/DeviceDetailCard";
import { RepairTimeline } from "../components/RepairTimeline";
import { DeviceRepairItems } from "../components/DeviceRepairItems";
import { WarrantyInfo } from "../components/WarrantyInfo";
import { ActivityLog } from "../components/ActivityLog";
import { useDevice } from "../hooks/useDevices";
import { ROUTES } from "../constants";

export default function DeviceDetailPage() {
  const params = useParams();
  const deviceId = params.id as string;
  const { data: device, isLoading, error } = useDevice(deviceId);

  return (
    <>
      <DashboardHeader />
      <div className="p-6 space-y-6">
        <Link to={ROUTES.DEVICES}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </Link>

        {isLoading && <p className="text-text-secondary">Loading device...</p>}
        {error && <p className="text-danger">Failed to load device.</p>}

        {device && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DeviceDetailCard device={device} />
              <RepairTimeline deviceId={deviceId} />
              <DeviceRepairItems deviceId={deviceId} />
            </div>
            <div className="space-y-6">
              <WarrantyInfo deviceId={deviceId} />
              <ActivityLog deviceId={deviceId} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}




