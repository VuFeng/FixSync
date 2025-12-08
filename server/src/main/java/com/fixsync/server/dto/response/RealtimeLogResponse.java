package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealtimeLogResponse {
    private UUID id;
    private UUID deviceId;
    private ActionType action;
    private String detail;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
}




