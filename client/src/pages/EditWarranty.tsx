import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { WarrantyForm } from "../components/WarrantyForm";
import { ROUTES } from "../constants";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useWarranty } from "../hooks/useWarranties";

export default function EditWarranty() {
  const { id } = useParams<{ id: string }>();
  const { data: warranty, isLoading, error } = useWarranty(id);

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <SkeletonCard />
        </div>
      </>
    );
  }

  if (error || !warranty) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <p className="text-danger">
            {error instanceof Error ? error.message : "Warranty not found"}
          </p>
        </div>
      </>
    );
  }

  // Calculate warranty months from start and end date
  const startDate = new Date(warranty.startDate);
  const endDate = new Date(warranty.endDate);
  const monthsDiff =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.WARRANTIES + `/${id}`}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Warranty
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Warranty
          </h1>
          <p className="text-text-secondary mb-6">
            Update warranty details
          </p>

          <WarrantyForm
            initialData={{
              deviceId: warranty.deviceId,
              repairItemId: warranty.repairItemId,
              warrantyMonths: monthsDiff,
            }}
            warrantyId={id}
            mode="edit"
          />
        </div>
      </div>
    </>
  );
}

