import { useQuery } from "@tanstack/react-query";
import { serviceCatalogService } from "../services/serviceCatalog.service";

export function useActiveServices() {
  return useQuery({
    queryKey: ["service-catalog", "active"],
    queryFn: () => serviceCatalogService.getActive(),
  });
}

export function useServiceCatalogs(
  page: number = 0,
  size: number = 100,
  sortBy: string = "name",
  sortDir: string = "ASC"
) {
  return useQuery({
    queryKey: ["service-catalog", page, size, sortBy, sortDir],
    queryFn: () => serviceCatalogService.getAll(page, size, sortBy, sortDir),
  });
}

export function useServiceCatalog(id: string) {
  return useQuery({
    queryKey: ["service-catalog", id],
    queryFn: () => serviceCatalogService.getById(id),
    enabled: !!id,
  });
}




