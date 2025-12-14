import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Download, Search, Plus } from "lucide-react";
import { DashboardHeader } from "../components/DashboardHeader";
import { Sidebar } from "../components/Sidebar";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { TransactionsTable } from "../components/TransactionsTable";
import { ROUTES } from "../constants";
import { useTransactions } from "../hooks/useTransactions";
import { useDevices } from "../hooks/useDevices";
import { exportTransactionsToCSV } from "../utils/export";
import { useToast } from "../hooks/useToast";
import { Breadcrumb } from "../components/Breadcrumb";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const toast = useToast();
  
  const { data: transactionsData } = useTransactions(page, 1000); // Get more for export
  const { data: devicesData } = useDevices(0, 200);

  const deviceMap = useMemo(() => {
    const map = new Map<string, { customer: string; phone: string }>();
    const devices = devicesData?.content || [];
    devices.forEach((d) => {
      map.set(d.id, {
        customer: d.customer?.name || d.customerName || "N/A",
        phone: d.customer?.phone || d.customerPhone || "N/A",
      });
    });
    return map;
  }, [devicesData]);

  const handleExport = () => {
    try {
      const transactions = transactionsData?.content || [];
      const transactionsWithCustomer = transactions.map((tx) => ({
        ...tx,
        customer: deviceMap.get(tx.deviceId)?.customer || "",
        phone: deviceMap.get(tx.deviceId)?.phone || "",
      }));

      exportTransactionsToCSV(transactionsWithCustomer);
      toast.success("Transactions exported successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export transactions"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1">
        <DashboardHeader />
        <div className="p-6 space-y-6">
          <Breadcrumb items={[{ label: "Transactions" }]} />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Transactions</h1>
              <p className="text-text-secondary">
                View and manage all payment transactions
              </p>
            </div>
            <Link to={ROUTES.TRANSACTION_NEW}>
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus className="w-4 h-4 mr-2" />
                New Transaction
              </Button>
            </Link>
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
                    placeholder="Search by customer name or phone..."
                    className="pl-10 bg-surface-secondary border-border text-text-primary"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                  />
                </div>
              </div>
              <Button
                className="bg-primary hover:bg-primary-dark w-full md:w-auto"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </Card>

          {/* Transactions Table */}
          <TransactionsTable search={search} page={page} onPageChange={setPage} />
        </div>
      </main>
    </div>
  );
}




