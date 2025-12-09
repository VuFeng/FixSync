package com.fixsync.server.controller;

import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.DeviceModelResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.service.DeviceModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/device-models")
@RequiredArgsConstructor
public class DeviceModelController {
    
    private final DeviceModelService deviceModelService;
    
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<?>> getModelsByBrandId(
            @PathVariable UUID brandId,
            @RequestParam(required = false, defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        
        if (paginated) {
            Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);
            PageResponse<DeviceModelResponse> response = deviceModelService.getModelsByBrandId(brandId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            List<DeviceModelResponse> models = deviceModelService.getModelsByBrandId(brandId);
            return ResponseEntity.ok(ApiResponse.success(models));
        }
    }
    
    @GetMapping("/device-type/{deviceType}")
    public ResponseEntity<ApiResponse<List<DeviceModelResponse>>> getModelsByDeviceType(@PathVariable String deviceType) {
        List<DeviceModelResponse> models = deviceModelService.getModelsByDeviceType(deviceType);
        return ResponseEntity.ok(ApiResponse.success(models));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceModelResponse>> getModelById(@PathVariable UUID id) {
        DeviceModelResponse response = deviceModelService.getModelById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/brand/{brandId}")
    public ResponseEntity<ApiResponse<DeviceModelResponse>> createModel(
            @PathVariable UUID brandId,
            @RequestBody DeviceModelResponse request) {
        DeviceModelResponse response = deviceModelService.createModel(brandId, request);
        return ResponseEntity.ok(ApiResponse.success("Tạo model thành công", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DeviceModelResponse>> updateModel(
            @PathVariable UUID id,
            @RequestBody DeviceModelResponse request) {
        DeviceModelResponse response = deviceModelService.updateModel(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật model thành công", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteModel(@PathVariable UUID id) {
        deviceModelService.deleteModel(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa model thành công", null));
    }
}

