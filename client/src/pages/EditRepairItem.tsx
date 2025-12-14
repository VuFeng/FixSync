import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { EditRepairItemForm } from "../components/EditRepairItemForm";
import { ROUTES } from "../constants";

export default function EditRepairItem() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <p className="text-danger">Invalid repair item ID</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.REPAIR_ITEMS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Repair Items
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Repair Item
          </h1>
          <p className="text-text-secondary mb-6">
            Update repair service or part details
          </p>

          <EditRepairItemForm repairItemId={id} />
        </div>
      </div>
    </>
  );
}

