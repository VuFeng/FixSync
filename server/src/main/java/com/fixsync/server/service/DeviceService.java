package com.fixsync.server.service;

import com.fixsync.server.dto.request.DeviceRequest;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.enums.DeviceStatus;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DeviceService {
    DeviceResponse createDevice(DeviceRequest request, UUID createdById);
    DeviceResponse updateDevice(UUID id, DeviceRequest request);
    DeviceResponse getDeviceById(UUID id);
    PageResponse<DeviceResponse> getAllDevices(Pageable pageable);
    DeviceResponse updateDeviceStatus(UUID id, DeviceStatus status, UUID userId);
    DeviceResponse assignDevice(UUID id, UUID assignedToId, UUID userId);
    void deleteDevice(UUID id);
}



