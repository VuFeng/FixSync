import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deviceModelService,
  type DeviceModelRequest,
} from "../services/deviceModel.service";

export function useCreateDeviceModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      brandId,
      data,
    }: {
      brandId: string;
      data: DeviceModelRequest;
    }) => deviceModelService.createModel(brandId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["device-models"] });
      queryClient.invalidateQueries({
        queryKey: ["device-models", "brand", variables.brandId],
      });
    },
  });
}

export function useUpdateDeviceModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeviceModelRequest }) =>
      deviceModelService.updateModel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["device-models"] });
      queryClient.invalidateQueries({ queryKey: ["device-model", variables.id] });
    },
  });
}

export function useDeleteDeviceModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deviceModelService.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-models"] });
    },
  });
}
