package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.DeviceRequest;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.Brand;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.DeviceModel;
import com.fixsync.server.entity.User;
import com.fixsync.server.entity.enums.ActionType;
import com.fixsync.server.entity.enums.DeviceStatus;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.BrandMapper;
import com.fixsync.server.mapper.DeviceMapper;
import com.fixsync.server.mapper.DeviceModelMapper;
import com.fixsync.server.repository.BrandRepository;
import com.fixsync.server.repository.DeviceModelRepository;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.DeviceService;
import com.fixsync.server.service.RealtimeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {
    
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final BrandRepository brandRepository;
    private final DeviceModelRepository deviceModelRepository;
    private final DeviceMapper deviceMapper;
    private final BrandMapper brandMapper;
    private final DeviceModelMapper deviceModelMapper;
    private final RealtimeLogService realtimeLogService;
    
    @Override
    @Transactional
    public DeviceResponse createDevice(DeviceRequest request, UUID createdById) {
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", createdById));
        
        // Load brand and model
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", request.getBrandId()));
        
        DeviceModel model = deviceModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Model", "id", request.getModelId()));
        
        Device device = deviceMapper.toEntity(request);
        device.setCreatedBy(createdBy);
        device.setBrandEntity(brand);
        device.setModelEntity(model);
        device.setStatus(request.getStatus() != null ? request.getStatus() : DeviceStatus.RECEIVED);
        
        // Set legacy fields for backward compatibility
        device.setBrand(brand.getName());
        device.setModel(model.getName());
        device.setDeviceType(model.getDeviceType());
        
        if (request.getAssignedTo() != null) {
            User assignedTo = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", request.getAssignedTo()));
            device.setAssignedTo(assignedTo);
        }
        
        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();
        
        // Log action
        realtimeLogService.createLog(deviceId, ActionType.CREATED, 
                "Thiết bị được tạo mới", createdById);
        
        // Reload device with EntityGraph to ensure brandEntity and modelEntity are loaded
        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional
    public DeviceResponse updateDevice(UUID id, DeviceRequest request) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        
        DeviceStatus oldStatus = device.getStatus();
        UUID oldAssignedTo = device.getAssignedTo() != null ? device.getAssignedTo().getId() : null;
        
        // Update brand and model if provided
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", request.getBrandId()));
            device.setBrandEntity(brand);
            device.setBrand(brand.getName());
        }
        
        if (request.getModelId() != null) {
            DeviceModel model = deviceModelRepository.findById(request.getModelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Model", "id", request.getModelId()));
            device.setModelEntity(model);
            device.setModel(model.getName());
            device.setDeviceType(model.getDeviceType());
        }
        
        deviceMapper.updateEntity(device, request);
        
        if (request.getAssignedTo() != null) {
            User assignedTo = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", request.getAssignedTo()));
            device.setAssignedTo(assignedTo);
        }
        
        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();
        
        // Log status change
        if (request.getStatus() != null && !request.getStatus().equals(oldStatus)) {
            realtimeLogService.createLog(deviceId, ActionType.STATUS_CHANGED,
                    String.format("Trạng thái thay đổi từ %s sang %s", oldStatus, request.getStatus()),
                    savedDevice.getCreatedBy().getId());
        }
        
        // Log assignment change
        if (request.getAssignedTo() != null && !request.getAssignedTo().equals(oldAssignedTo)) {
            realtimeLogService.createLog(deviceId, ActionType.ASSIGNED,
                    "Thiết bị được giao cho kỹ thuật viên khác", savedDevice.getCreatedBy().getId());
        }
        
        // Reload device with EntityGraph to ensure brandEntity and modelEntity are loaded
        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional(readOnly = true)
    public DeviceResponse getDeviceById(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        return mapToResponse(device);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<DeviceResponse> getAllDevices(Pageable pageable) {
        Page<Device> devices = deviceRepository.findAll(pageable);
        
        // Map each device with brand and model objects
        java.util.List<DeviceResponse> deviceResponses = devices.getContent().stream()
                .map(this::mapToResponse)
                .toList();
        
        return PageResponse.<DeviceResponse>builder()
                .content(deviceResponses)
                .page(devices.getNumber())
                .size(devices.getSize())
                .totalElements(devices.getTotalElements())
                .totalPages(devices.getTotalPages())
                .first(devices.isFirst())
                .last(devices.isLast())
                .build();
    }
    
    @Override
    @Transactional
    public DeviceResponse updateDeviceStatus(UUID id, DeviceStatus status, UUID userId) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        
        DeviceStatus oldStatus = device.getStatus();
        device.setStatus(status);
        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();
        
        realtimeLogService.createLog(deviceId, ActionType.STATUS_CHANGED,
                String.format("Trạng thái thay đổi từ %s sang %s", oldStatus, status), userId);
        
        // Reload device with EntityGraph to ensure brandEntity and modelEntity are loaded
        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional
    public DeviceResponse assignDevice(UUID id, UUID assignedToId, UUID userId) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        
        User assignedTo = userRepository.findById(assignedToId)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", assignedToId));
        
        device.setAssignedTo(assignedTo);
        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();
        
        realtimeLogService.createLog(deviceId, ActionType.ASSIGNED,
                String.format("Thiết bị được giao cho %s", assignedTo.getFullName()), userId);
        
        // Reload device with EntityGraph to ensure brandEntity and modelEntity are loaded
        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional
    public void deleteDevice(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        deviceRepository.delete(device);
    }
    
    /**
     * Helper method to map Device to DeviceResponse with brand and model objects
     */
    private DeviceResponse mapToResponse(Device device) {
        DeviceResponse response = deviceMapper.toResponse(device);
        
        // Map brandEntity to BrandResponse object
        if (device.getBrandEntity() != null) {
            response.setBrand(brandMapper.toResponse(device.getBrandEntity()));
        }
        
        // Map modelEntity to DeviceModelResponse object
        if (device.getModelEntity() != null) {
            response.setModel(deviceModelMapper.toResponse(device.getModelEntity()));
        }
        
        return response;
    }
}



