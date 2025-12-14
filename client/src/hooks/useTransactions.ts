import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "../services/transaction.service";
import { PAGINATION } from "../constants";
import type { PageResponse, Transaction, TransactionRequest } from "../types";

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

export function useTransaction(id: string | undefined) {
  return useQuery<Transaction>({
    queryKey: ["transaction", id],
    queryFn: () => transactionService.getTransactionById(id!),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TransactionRequest) =>
      transactionService.createTransaction(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      if (data?.deviceId) {
        queryClient.invalidateQueries({ queryKey: ["device", data.deviceId] });
      }
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TransactionRequest;
    }) => transactionService.updateTransaction(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", variables.id] });
      if (data?.deviceId) {
        queryClient.invalidateQueries({ queryKey: ["device", data.deviceId] });
      }
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transactionService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}




