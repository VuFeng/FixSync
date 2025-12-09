import { useMemo } from "react";
import { Shield, Search } from "lucide-react";
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
import { Input } from "./ui/Input";
import { useWarranties } from "../hooks/useWarrantiesList";
import { useDevices } from "../hooks/useDevices";
import { formatDate } from "../utils/format";
import type { Warranty } from "../types";
import { SkeletonTable } from "./ui/Skeleton";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

const getStatus = (w: Warranty) => {
  const end = new Date(w.endDate).getTime();
  return end >= Date.now() ? "active" : "expired";
};

export function WarrantiesTable({ search, onSearch }: Props) {
  const { data, isLoading, error } = useWarranties(0, 100);
  const { data: devicesData } = useDevices(0, 200);

  const deviceMap = useMemo(() => {
    const map = new Map<
      string,
      { name: string; customer: string; imei?: string }
    >();
    devicesData?.content.forEach((d) => {
      const name = [d.brand?.name, d.model?.name, d.deviceType]
        .filter(Boolean)
        .join(" ");
      map.set(d.id, {
        name,
        customer: d.customerName,
        imei: d.imei || undefined,
      });
    });
    return map;
  }, [devicesData]);

  const warranties = data?.content || [];

  const filtered: Array<
    Warranty & { deviceName?: string; customer?: string; imei?: string }
  > = warranties
    .map((w) => ({
      ...w,
      deviceName: deviceMap.get(w.deviceId)?.name,
      customer: deviceMap.get(w.deviceId)?.customer,
      imei: deviceMap.get(w.deviceId)?.imei,
    }))
    .filter((w) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        w.warrantyCode.toLowerCase().includes(q) ||
        w.imei?.toLowerCase().includes(q) ||
        w.customer?.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-4">
      <Card className="bg-surface border-border p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-tertiary" />
              <Input
                placeholder="Search by warranty code or IMEI..."
                className="pl-10 bg-surface-secondary border-border text-text-primary"
                value={search}
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-surface border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-text-secondary">Warranty Code</TableHead>
              <TableHead className="text-text-secondary">Device</TableHead>
              <TableHead className="text-text-secondary">Customer</TableHead>
              <TableHead className="text-text-secondary">Period</TableHead>
              <TableHead className="text-text-secondary">Status</TableHead>
              <TableHead className="text-text-secondary">Coverage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="p-8">
                  <SkeletonTable rows={5} cols={6} />
                </TableCell>
              </TableRow>
            )}
            {error && !isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-danger">
                  Error loading warranties. Please try again.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !error && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-text-secondary">
                  No warranties found
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              !error &&
              filtered.map((warranty) => {
                const status = getStatus(warranty);
                const coverage =
                  warranty.repairItemId && warranty.repairItemId !== ""
                    ? `Linked repair item ${warranty.repairItemId}`
                    : "General device warranty";
                return (
                  <TableRow
                    key={warranty.id}
                    className="border-border hover:bg-surface-secondary/50"
                  >
                    <TableCell className="text-text-primary font-mono text-sm">
                      {warranty.warrantyCode}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {warranty.deviceId
                        ? warranty.deviceName || warranty.deviceId
                        : "—"}
                      {warranty.imei ? (
                        <div className="text-text-tertiary text-xs">
                          IMEI: {warranty.imei}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {warranty.customer || "—"}
                    </TableCell>
                    <TableCell className="text-text-secondary text-sm">
                      {formatDate(warranty.startDate)} to{" "}
                      {formatDate(warranty.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-text-secondary space-y-1">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span>{coverage}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}



