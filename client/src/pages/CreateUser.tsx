import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Button } from "../components/ui/Button";
import { UserForm } from "../components/UserForm";
import { ROUTES } from "../constants";

export default function CreateUser() {
  return (
    <>
      <DashboardHeader />
      <div className="p-6">
        <Link to={ROUTES.USERS}>
          <Button
            variant="ghost"
            className="text-text-secondary hover:text-text-primary mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Users
          </Button>
        </Link>

        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Create User
          </h1>
          <p className="text-text-secondary mb-6">
            Add a new user to the system
          </p>

          <UserForm mode="create" />
        </div>
      </div>
    </>
  );
}

