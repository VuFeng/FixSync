package com.fixsync.server.dto.request;

import com.fixsync.server.entity.enums.DeviceStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairSessionRequest {
    @NotNull(message = "ID thiết bị không được để trống")
    private UUID deviceId;

    private DeviceStatus status;
    private LocalDateTime receivedDate;
    private LocalDateTime expectedReturnDate;
    private String note;
    private UUID assignedTo;
}







