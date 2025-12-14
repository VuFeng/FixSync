import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { WarrantyForm } from "../components/WarrantyForm";
import { ROUTES } from "../constants";

export default function CreateWarranty() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get("deviceId");
  const repairItemId = searchParams.get("repairItemId");

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={deviceId ? ROUTES.DEVICE_DETAIL(deviceId) : ROUTES.WARRANTIES}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {deviceId ? "Device Details" : "Warranties"}
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create Warranty
          </h1>
          <p className="text-text-secondary mb-6">
            Create a new warranty for a device or repair item
          </p>

          <WarrantyForm
            initialData={
              deviceId
                ? {
                    deviceId,
                    repairItemId: repairItemId || undefined,
                  }
                : undefined
            }
            mode="create"
          />
        </div>
      </div>
    </>
  );
}

