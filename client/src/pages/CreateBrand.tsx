import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { BrandForm } from "../components/BrandForm";
import { ROUTES } from "../constants";

export default function CreateBrand() {
  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.BRANDS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Brands
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create New Brand
          </h1>
          <p className="text-text-secondary mb-6">
            Add a new device brand to the system
          </p>

          <BrandForm />
        </div>
      </div>
    </>
  );
}


