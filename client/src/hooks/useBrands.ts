import { useQuery } from '@tanstack/react-query';
import { brandService } from '../services/brand.service';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: () => brandService.getAllBrands(0, 100),
  });
}

export function useActiveBrands() {
  return useQuery({
    queryKey: ['brands', 'active'],
    queryFn: () => brandService.getActiveBrands(),
  });
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id,
  });
}



