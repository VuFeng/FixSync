import { useQuery } from '@tanstack/react-query';
import { deviceModelService } from '../services/deviceModel.service';

export function useDeviceModelsByBrand(brandId: string) {
  return useQuery({
    queryKey: ['deviceModels', 'brand', brandId],
    queryFn: () => deviceModelService.getModelsByBrandId(brandId, false),
    enabled: !!brandId,
  });
}

export function useDeviceModelsByType(deviceType: string) {
  return useQuery({
    queryKey: ['deviceModels', 'type', deviceType],
    queryFn: () => deviceModelService.getModelsByDeviceType(deviceType),
    enabled: !!deviceType,
  });
}



