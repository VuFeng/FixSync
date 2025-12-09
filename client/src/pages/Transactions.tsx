import { useState } from "react";
import { Download, Search } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { TransactionsTable } from "../components/TransactionsTable";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
            <p className="text-text-secondary">
              View and manage all payment transactions
            </p>
          </div>

          {/* Filters */}
          <Card className="bg-surface border-border p-4">
            <div className="flex gap-4 items-end flex-col md:flex-row">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
                  <Input
                    placeholder="Search by customer or transaction ID..."
                    className="pl-10 bg-surface-secondary border-border text-text-primary"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary-dark w-full md:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </Card>

          {/* Transactions Table */}
          <TransactionsTable search={search} />
        </div>
      </main>
    </div>
  );
}




