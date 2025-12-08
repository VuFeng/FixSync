package com.fixsync.server.controller;

import com.fixsync.server.dto.request.DeviceRequest;
import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.enums.DeviceStatus;
import com.fixsync.server.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.fixsync.server.service.UserContextService;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
public class DeviceController {
    
    private final DeviceService deviceService;
    private final UserContextService userContextService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<DeviceResponse>> createDevice(
            @Valid @RequestBody DeviceRequest request) {
        UUID userId = userContextService.getCurrentUserId();
        DeviceResponse response = deviceService.createDevice(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo thiết bị thành công", response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceResponse>> updateDevice(
            @PathVariable UUID id,
            @Valid @RequestBody DeviceRequest request) {
        DeviceResponse response = deviceService.updateDevice(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thiết bị thành công", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceResponse>> getDeviceById(@PathVariable UUID id) {
        DeviceResponse response = deviceService.getDeviceById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DeviceResponse>>> getAllDevices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<DeviceResponse> response = deviceService.getAllDevices(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<DeviceResponse>> updateDeviceStatus(
            @PathVariable UUID id,
            @RequestParam DeviceStatus status) {
        UUID userId = userContextService.getCurrentUserId();
        DeviceResponse response = deviceService.updateDeviceStatus(id, status, userId);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", response));
    }
    
    @PatchMapping("/{id}/assign")
    public ResponseEntity<ApiResponse<DeviceResponse>> assignDevice(
            @PathVariable UUID id,
            @RequestParam UUID assignedToId) {
        UUID userId = userContextService.getCurrentUserId();
        DeviceResponse response = deviceService.assignDevice(id, assignedToId, userId);
        return ResponseEntity.ok(ApiResponse.success("Giao thiết bị thành công", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDevice(@PathVariable UUID id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa thiết bị thành công", null));
    }
}

