import { useState } from "react";
import { Shield } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { WarrantiesTable } from "../components/WarrantiesTable";

export default function WarrantiesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 mb-6">
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

          <WarrantiesTable search={search} onSearch={setSearch} />
        </div>
      </main>
    </div>
  );
}




