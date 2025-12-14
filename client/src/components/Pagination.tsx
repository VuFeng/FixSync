import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "./ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
}: PaginationProps) {
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;
  const startItem = page * pageSize + 1;
  const endItem = Math.min((page + 1) * pageSize, totalElements || 0);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border ${className}`}>
      <div className="flex items-center gap-4">
        {totalElements !== undefined && (
          <p className="text-sm text-text-secondary">
            Showing <span className="font-medium text-text-primary">{startItem}</span> to{" "}
            <span className="font-medium text-text-primary">{endItem}</span> of{" "}
            <span className="font-medium text-text-primary">{totalElements}</span> results
          </p>
        )}
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Show:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-20 bg-surface-secondary border-border text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-surface-secondary border-border">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary"
          onClick={() => onPageChange(0)}
          disabled={isFirst}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={isFirst}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm text-text-secondary px-2">
            Page {page + 1} of {totalPages || 1}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary"
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disabled={isLast}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-text-secondary"
          onClick={() => onPageChange(totalPages - 1)}
          disabled={isLast}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}







