package com.fixsync.server.service;

import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RealtimeLogResponse;
import com.fixsync.server.entity.enums.ActionType;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface RealtimeLogService {
    RealtimeLogResponse createLog(UUID deviceId, ActionType action, String detail, UUID createdById);
    List<RealtimeLogResponse> getLogsByDeviceId(UUID deviceId);
    PageResponse<RealtimeLogResponse> getLogsByDeviceId(UUID deviceId, Pageable pageable);
    PageResponse<RealtimeLogResponse> getLogsByDeviceIdAndAction(UUID deviceId, ActionType action, Pageable pageable);
}




