package com.fixsync.server.controller;

import com.fixsync.server.dto.request.RepairSessionRequest;
import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairSessionResponse;
import com.fixsync.server.service.RepairSessionService;
import com.fixsync.server.service.UserContextService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/repair-sessions")
@RequiredArgsConstructor
public class RepairSessionController {

    private final RepairSessionService repairSessionService;
    private final UserContextService userContextService;

    @PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
    @PostMapping
    public ResponseEntity<ApiResponse<RepairSessionResponse>> createSession(
            @Valid @RequestBody RepairSessionRequest request) {
        UUID userId = userContextService.getCurrentUserId();
        RepairSessionResponse response = repairSessionService.createSession(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo phiên sửa chữa thành công", response));
    }

    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN','RECEPTIONIST')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairSessionResponse>> updateSession(
            @PathVariable UUID id,
            @Valid @RequestBody RepairSessionRequest request) {
        RepairSessionResponse response = repairSessionService.updateSession(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phiên sửa chữa thành công", response));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RepairSessionResponse>> getSessionById(@PathVariable UUID id) {
        RepairSessionResponse response = repairSessionService.getSessionById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<RepairSessionResponse>>> getAllSessions(
            @RequestParam(required = false) UUID deviceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<RepairSessionResponse> response;
        if (deviceId != null) {
            response = repairSessionService.getSessionsByDevice(deviceId, pageable);
        } else {
            response = repairSessionService.getAllSessions(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}







