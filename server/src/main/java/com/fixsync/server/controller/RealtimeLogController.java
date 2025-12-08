package com.fixsync.server.controller;

import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RealtimeLogResponse;
import com.fixsync.server.entity.enums.ActionType;
import com.fixsync.server.service.RealtimeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class RealtimeLogController {
    
    private final RealtimeLogService realtimeLogService;
    
    @GetMapping("/device/{deviceId}")
    public ResponseEntity<?> getLogsByDeviceId(
            @PathVariable UUID deviceId,
            @RequestParam(required = false, defaultValue = "false") boolean paginated,
            @RequestParam(required = false) ActionType action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        if (paginated) {
            Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            
            PageResponse<RealtimeLogResponse> response;
            if (action != null) {
                response = realtimeLogService.getLogsByDeviceIdAndAction(deviceId, action, pageable);
            } else {
                response = realtimeLogService.getLogsByDeviceId(deviceId, pageable);
            }
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            List<RealtimeLogResponse> response = realtimeLogService.getLogsByDeviceId(deviceId);
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }
}

