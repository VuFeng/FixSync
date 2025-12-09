import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { CreateRepairItemForm } from "../components/CreateRepairItemForm";
import { ROUTES } from "../constants";

export default function CreateRepairItem() {
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
            Create Repair Item
          </h1>
          <p className="text-text-secondary mb-6">
            Add a new repair service or part to a device
          </p>

          <CreateRepairItemForm />
        </div>
      </div>
    </>
  );
}




