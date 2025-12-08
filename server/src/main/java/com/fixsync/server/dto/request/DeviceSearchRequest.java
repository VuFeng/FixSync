package com.fixsync.server.dto.request;

import com.fixsync.server.entity.enums.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * DTO cho việc tìm kiếm và lọc thiết bị
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceSearchRequest {
    private String customerName;
    private String customerPhone;
    private String deviceType;
    private String brand;
    private DeviceStatus status;
    private UUID assignedToId;
    private UUID createdById;
}


