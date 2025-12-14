import { useQuery } from '@tanstack/react-query';
import { deviceModelService } from '../services/deviceModel.service';

export function useDeviceModelsByBrand(brandId: string) {
  return useQuery({
    queryKey: ['device-models', 'brand', brandId],
    queryFn: () => deviceModelService.getModelsByBrandId(brandId, false),
    enabled: !!brandId,
  });
}

export function useDeviceModelsByType(deviceType: string) {
  return useQuery({
    queryKey: ['device-models', 'type', deviceType],
    queryFn: () => deviceModelService.getModelsByDeviceType(deviceType),
    enabled: !!deviceType,
  });
}

export function useDeviceModel(id: string) {
  return useQuery({
    queryKey: ['device-model', id],
    queryFn: () => deviceModelService.getModelById(id),
    enabled: !!id,
  });
}



