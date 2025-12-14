import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { TransactionForm } from "../components/TransactionForm";
import { ROUTES } from "../constants";

export default function CreateTransaction() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get("deviceId");

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={deviceId ? ROUTES.DEVICE_DETAIL(deviceId) : ROUTES.TRANSACTIONS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {deviceId ? "Device Details" : "Transactions"}
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create Transaction
          </h1>
          <p className="text-text-secondary mb-6">
            Record a new payment transaction
          </p>

          <TransactionForm
            initialData={deviceId ? { deviceId } : undefined}
            mode="create"
          />
        </div>
      </div>
    </>
  );
}

