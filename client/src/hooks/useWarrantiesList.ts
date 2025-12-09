import { useQuery } from "@tanstack/react-query";
import { warrantyService } from "../services/warranty.service";
import { PAGINATION } from "../constants";
import type { PageResponse, Warranty } from "../types";

export function useWarranties(
  page: number = PAGINATION.DEFAULT_PAGE,
  size: number = PAGINATION.DEFAULT_SIZE,
  sortBy: string = PAGINATION.DEFAULT_SORT_BY,
  sortDir: string = PAGINATION.DEFAULT_SORT_DIR
) {
  return useQuery<PageResponse<Warranty>>({
    queryKey: ["warranties", page, size, sortBy, sortDir],
    queryFn: () => warrantyService.getAll(page, size, sortBy, sortDir),
  });
}




