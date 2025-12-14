import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { DeviceForm } from "../components/DeviceForm";
import { ROUTES } from "../constants";

export default function EditDevice() {
  const params = useParams();
  const deviceId = params.id as string;

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.DEVICES}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Devices
          </Button>
        </Link>

        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Device
          </h1>
          <p className="text-text-secondary mb-6">
            Update device information
          </p>

          <DeviceForm deviceId={deviceId} />
        </div>
      </div>
    </>
  );
}



