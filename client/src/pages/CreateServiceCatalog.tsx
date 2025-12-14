import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { ServiceCatalogForm } from "../components/ServiceCatalogForm";
import { ROUTES } from "../constants";

export default function CreateServiceCatalog() {
  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.SERVICE_CATALOG}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Service Catalog
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create New Service
          </h1>
          <p className="text-text-secondary mb-6">
            Add a new service to the catalog
          </p>

          <ServiceCatalogForm />
        </div>
      </div>
    </>
  );
}



