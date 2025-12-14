import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "./ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Table";
import { Badge } from "./ui/Badge";
import { formatCurrency, formatDate } from "../utils/format";
import { useTransactions } from "../hooks/useTransactions";
import { useDevices } from "../hooks/useDevices";
import type { Transaction } from "../types";
import { SkeletonTable } from "./ui/Skeleton";
import { Button } from "./ui/Button";
import { ROUTES } from "../constants";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { Receipt, Search } from "lucide-react";

interface Props {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
}

const methodMap: Record<string, string> = {
  CASH: "Cash",
  MOMO: "MoMo",
  BANKING: "Banking",
};

export function TransactionsTable({ search, page, onPageChange }: Props) {
  const pageSize = 10;
  const { data, isLoading, error } = useTransactions(page, pageSize);
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

  const transactions = data?.content || [];
  const totalPages = data?.totalPages ?? 1;

  const filtered: (Transaction & { customer?: string; phone?: string })[] =
    transactions
      .map((tx) => ({
        ...tx,
        customer: deviceMap.get(tx.deviceId)?.customer,
        phone: deviceMap.get(tx.deviceId)?.phone,
      }))
      .filter((tx) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          tx.customer?.toLowerCase().includes(q) ||
          tx.phone?.toLowerCase().includes(q)
        );
      });

  if (isLoading) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8">
          <SkeletonTable rows={5} cols={6} />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-surface border-border overflow-hidden">
        <div className="p-8 text-center text-danger">
          Error loading transactions. Please try again.
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-text-secondary">Customer</TableHead>
            <TableHead className="text-text-secondary">Phone</TableHead>
            <TableHead className="text-text-secondary">Amount</TableHead>
            <TableHead className="text-text-secondary">Method</TableHead>
            <TableHead className="text-text-secondary">Date</TableHead>
            <TableHead className="text-text-secondary">Status</TableHead>
            <TableHead className="text-text-secondary">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="p-0">
                <div className="py-12">
                  <EmptyState
                    icon={search ? Search : Receipt}
                    title={search ? "No transactions found" : "No transactions yet"}
                    description={
                      search
                        ? "Try adjusting your search criteria"
                        : "Transactions will appear here once payments are recorded"
                    }
                    action={
                      !search
                        ? {
                            label: "Create Transaction",
                            onClick: () => (window.location.href = ROUTES.TRANSACTION_NEW),
                          }
                        : undefined
                    }
                    className="border-0 shadow-none"
                  />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((tx) => (
              <TableRow
                key={tx.id}
                className="border-border hover:bg-surface-secondary/50"
              >
                <TableCell className="text-text-primary font-medium">
                  {tx.customer || "—"}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {tx.phone || "—"}
                </TableCell>
                <TableCell className="text-text-primary font-medium">
                  {formatCurrency(tx.finalAmount)}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {methodMap[tx.paymentMethod] || tx.paymentMethod}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {formatDate(tx.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    Paid
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link to={ROUTES.TRANSACTION_DETAIL(tx.id)}>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={data?.totalElements}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </Card>
  );
}



