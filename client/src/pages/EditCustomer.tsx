import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { CustomerForm } from "../components/CustomerForm";
import { useCustomer } from "../hooks/useCustomers";
import { ROUTES } from "../constants";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, error } = useCustomer(id);

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

  if (error || !customer) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <div className="text-danger">Failed to load customer</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.CUSTOMERS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Customers
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Customer
          </h1>
          <p className="text-text-secondary mb-6">
            Update customer information
          </p>

          <CustomerForm mode="edit" initialData={customer} customerId={id} />
        </div>
      </div>
    </>
  );
}



