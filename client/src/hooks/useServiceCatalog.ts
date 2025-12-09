import { useQuery } from "@tanstack/react-query";
import { serviceCatalogService } from "../services/serviceCatalog.service";

export function useActiveServices() {
  return useQuery({
    queryKey: ["service-catalog", "active"],
    queryFn: () => serviceCatalogService.getActive(),
  });
}




