import { Link } from "react-router-dom";
import { Users, Plus } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { UsersTable } from "../components/UsersTable";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../constants";
import { Breadcrumb } from "../components/Breadcrumb";

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <Breadcrumb items={[{ label: "Users" }]} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Team Members</h1>
                <p className="text-text-secondary">Manage users and permissions</p>
              </div>
            </div>
            <Link to={ROUTES.USER_NEW}>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
          </div>

          <UsersTable />
        </div>
      </main>
    </div>
  );
}




