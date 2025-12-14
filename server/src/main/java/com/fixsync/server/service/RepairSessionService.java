package com.fixsync.server.service;

import com.fixsync.server.dto.request.RepairSessionRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairSessionResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface RepairSessionService {
    RepairSessionResponse createSession(RepairSessionRequest request, UUID createdById);
    RepairSessionResponse updateSession(UUID id, RepairSessionRequest request);
    RepairSessionResponse getSessionById(UUID id);
    PageResponse<RepairSessionResponse> getAllSessions(Pageable pageable);
    PageResponse<RepairSessionResponse> getSessionsByDevice(UUID deviceId, Pageable pageable);
}







