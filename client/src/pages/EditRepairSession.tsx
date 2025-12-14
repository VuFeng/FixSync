import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { RepairSessionForm } from "../components/RepairSessionForm";
import { useRepairSession } from "../hooks/useRepairSessions";
import { ROUTES } from "../constants";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function EditRepairSession() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, error } = useRepairSession(id);

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

  if (error || !session) {
    return (
      <>
        <DashboardHeader />
        <div className="p-6">
          <div className="text-danger">Failed to load repair session</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.REPAIR_SESSIONS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Repair Sessions
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Edit Repair Session
          </h1>
          <p className="text-text-secondary mb-6">
            Update repair session information
          </p>

          <RepairSessionForm mode="edit" initialData={session} sessionId={id} />
        </div>
      </div>
    </>
  );
}



