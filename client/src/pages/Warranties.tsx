import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Plus } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { WarrantiesTable } from "../components/WarrantiesTable";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../constants";
import { Breadcrumb } from "../components/Breadcrumb";

export default function WarrantiesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <Breadcrumb items={[{ label: "Warranties" }]} />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Warranties</h1>
                <p className="text-text-secondary">
                  Manage warranty coverage and claims
                </p>
              </div>
            </div>
            <Link to={ROUTES.WARRANTIES + "/new"}>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                New Warranty
              </Button>
            </Link>
          </div>

          <WarrantiesTable search={search} onSearch={setSearch} />
        </div>
      </main>
    </div>
  );
}




