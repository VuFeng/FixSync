package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.DeviceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceResponse {
    private UUID id;
    private String customerName;
    private String customerPhone;
    private String deviceType;
    
    // Brand and Model as objects
    private BrandResponse brand;
    private DeviceModelResponse model;
    
    private String imei;
    private String color;
    private LocalDateTime receivedDate;
    private LocalDateTime expectedReturnDate;
    private Integer warrantyMonths;
    private UserResponse createdBy;
    private UserResponse assignedTo;
    private DeviceStatus status;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RepairItemResponse> repairItems;
    private TransactionResponse transaction;
}



