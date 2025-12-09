import { useMemo } from "react";
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

interface Props {
  search: string;
}

const methodMap: Record<string, string> = {
  CASH: "Cash",
  MOMO: "MoMo",
  BANKING: "Banking",
};

export function TransactionsTable({ search }: Props) {
  const { data, isLoading, error } = useTransactions(0, 100);
  const { data: devicesData } = useDevices(0, 200);

  const deviceMap = useMemo(() => {
    const map = new Map<string, { customer: string; phone: string }>();
    devicesData?.content.forEach((d) => {
      map.set(d.id, {
        customer: d.customerName,
        phone: d.customerPhone,
      });
    });
    return map;
  }, [devicesData]);

  const transactions = data?.content || [];

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
          tx.id.toLowerCase().includes(q) ||
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
            <TableHead className="text-text-secondary">Transaction ID</TableHead>
            <TableHead className="text-text-secondary">Customer</TableHead>
            <TableHead className="text-text-secondary">Amount</TableHead>
            <TableHead className="text-text-secondary">Method</TableHead>
            <TableHead className="text-text-secondary">Date</TableHead>
            <TableHead className="text-text-secondary">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-text-secondary">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((tx) => (
              <TableRow
                key={tx.id}
                className="border-border hover:bg-surface-secondary/50"
              >
                <TableCell className="text-text-primary font-medium">
                  {tx.id}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {tx.customer || "—"}
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
                    Completed
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}



