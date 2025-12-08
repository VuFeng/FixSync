package com.fixsync.server.controller;

import com.fixsync.server.dto.request.WarrantyRequest;
import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.WarrantyResponse;
import com.fixsync.server.service.WarrantyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warranties")
@RequiredArgsConstructor
public class WarrantyController {
    
    private final WarrantyService warrantyService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<WarrantyResponse>> createWarranty(
            @Valid @RequestBody WarrantyRequest request) {
        WarrantyResponse response = warrantyService.createWarranty(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo bảo hành thành công", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WarrantyResponse>> getWarrantyById(@PathVariable UUID id) {
        WarrantyResponse response = warrantyService.getWarrantyById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/code/{warrantyCode}")
    public ResponseEntity<ApiResponse<WarrantyResponse>> getWarrantyByCode(@PathVariable String warrantyCode) {
        WarrantyResponse response = warrantyService.getWarrantyByCode(warrantyCode);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getWarrantiesByDeviceId(
            @PathVariable UUID deviceId,
            @RequestParam(required = false, defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        if (paginated) {
            Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            PageResponse<WarrantyResponse> response = warrantyService.getWarrantiesByDeviceId(deviceId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            List<WarrantyResponse> response = warrantyService.getWarrantiesByDeviceId(deviceId);
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }
    
    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<WarrantyResponse>>> getWarrantiesExpiringBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<WarrantyResponse> response = warrantyService.getWarrantiesExpiringBetween(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/expired")
    public ResponseEntity<ApiResponse<List<WarrantyResponse>>> getExpiredWarranties() {
        List<WarrantyResponse> response = warrantyService.getExpiredWarranties();
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WarrantyResponse>> updateWarranty(
            @PathVariable UUID id,
            @Valid @RequestBody WarrantyRequest request) {
        WarrantyResponse response = warrantyService.updateWarranty(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật bảo hành thành công", response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWarranty(@PathVariable UUID id) {
        warrantyService.deleteWarranty(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa bảo hành thành công", null));
    }
}

