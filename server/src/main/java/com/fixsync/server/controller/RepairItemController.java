package com.fixsync.server.controller;

import com.fixsync.server.dto.request.RepairItemRequest;
import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairItemResponse;
import com.fixsync.server.service.RepairItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repair-items")
@RequiredArgsConstructor
public class RepairItemController {
    
    private final RepairItemService repairItemService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<RepairItemResponse>> createRepairItem(
            @Valid @RequestBody RepairItemRequest request) {
        RepairItemResponse response = repairItemService.createRepairItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo dịch vụ sửa chữa thành công", response));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairItemResponse>> updateRepairItem(
            @PathVariable UUID id,
            @Valid @RequestBody RepairItemRequest request) {
        RepairItemResponse response = repairItemService.updateRepairItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật dịch vụ sửa chữa thành công", response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairItemResponse>> getRepairItemById(@PathVariable UUID id) {
        RepairItemResponse response = repairItemService.getRepairItemById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getRepairItemsByDeviceId(
            @PathVariable UUID deviceId,
            @RequestParam(required = false, defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        if (paginated) {
            Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            PageResponse<RepairItemResponse> response = repairItemService.getRepairItemsByDeviceId(deviceId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            List<RepairItemResponse> response = repairItemService.getRepairItemsByDeviceId(deviceId);
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }
    
    @GetMapping("/device/{deviceId}/total-cost")
    public ResponseEntity<ApiResponse<Integer>> getTotalCostByDeviceId(@PathVariable UUID deviceId) {
        Integer totalCost = repairItemService.calculateTotalCostByDeviceId(deviceId);
        return ResponseEntity.ok(ApiResponse.success(totalCost));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRepairItem(@PathVariable UUID id) {
        repairItemService.deleteRepairItem(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa dịch vụ sửa chữa thành công", null));
    }
}

