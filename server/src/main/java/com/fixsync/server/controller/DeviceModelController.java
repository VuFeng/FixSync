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
}

