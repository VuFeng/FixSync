import { useQuery } from "@tanstack/react-query";
import { transactionService } from "../services/transaction.service";
import { PAGINATION } from "../constants";
import type { PageResponse, Transaction } from "../types";

export function useTransactions(
  page: number = PAGINATION.DEFAULT_PAGE,
  size: number = PAGINATION.DEFAULT_SIZE,
  sortBy: string = PAGINATION.DEFAULT_SORT_BY,
  sortDir: string = PAGINATION.DEFAULT_SORT_DIR
) {
  return useQuery<PageResponse<Transaction>>({
    queryKey: ["transactions", page, size, sortBy, sortDir],
    queryFn: () =>
      transactionService.getAllTransactions(page, size, sortBy, sortDir),
  });
}




