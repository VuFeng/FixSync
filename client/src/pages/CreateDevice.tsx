import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { ReceiveDeviceForm } from "../components/ReceiveDeviceForm";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../constants";

export default function CreateDevice() {
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

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Receive New Device
          </h1>
          <p className="text-text-secondary mb-6">
            Register a new device for repair
          </p>

          <ReceiveDeviceForm />
        </div>
      </div>
    </>
  );
}



