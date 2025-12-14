import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { TransactionForm } from "../components/TransactionForm";
import { ROUTES } from "../constants";
import { SkeletonCard } from "../components/ui/Skeleton";
import { useTransaction } from "../hooks/useTransactions";

export default function EditTransaction() {
  const { id } = useParams<{ id: string }>();
  const { data: transaction, isLoading, error } = useTransaction(id);

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

  if (error || !transaction) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <p className="text-danger">
            {error instanceof Error ? error.message : "Transaction not found"}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.TRANSACTION_DETAIL(id!)}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transaction
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Transaction
          </h1>
          <p className="text-text-secondary mb-6">
            Update transaction details
          </p>

          <TransactionForm
            initialData={{
              deviceId: transaction.deviceId,
              total: transaction.total,
              discount: transaction.discount,
              paymentMethod: transaction.paymentMethod,
            }}
            transactionId={id}
            mode="edit"
          />
        </div>
      </div>
    </>
  );
}

