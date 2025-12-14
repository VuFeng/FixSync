package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.DeviceStatus;
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
public class RepairSessionResponse {
    private UUID id;
    private UUID deviceId;
    private DeviceResponse device; // Full device information
    private DeviceStatus status;
    private LocalDateTime receivedDate;
    private LocalDateTime expectedReturnDate;
    private String note;
    private UserResponse assignedTo;
    private UserResponse createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}







