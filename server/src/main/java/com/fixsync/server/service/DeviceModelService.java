package com.fixsync.server.service;

import com.fixsync.server.dto.response.DeviceModelResponse;
import com.fixsync.server.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface DeviceModelService {
    List<DeviceModelResponse> getModelsByBrandId(UUID brandId);
    PageResponse<DeviceModelResponse> getModelsByBrandId(UUID brandId, Pageable pageable);
    List<DeviceModelResponse> getModelsByDeviceType(String deviceType);
    DeviceModelResponse getModelById(UUID id);
}

