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
    
    // Customer as object (preferred)
    private CustomerResponse customer;
    
    // Legacy fields - kept for backward compatibility
    // Will be populated from customer if customer exists
    private String customerName;
    private String customerPhone;
    
    private String deviceType;
    
    // Brand and Model as objects
    private BrandResponse brand;
    private DeviceModelResponse model;
    
    private String imei;
    private String color;
    private UserResponse createdBy;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RepairItemResponse> repairItems;
    private TransactionResponse transaction;
    // Convenience totals
    private Integer repairSubtotal;      // sum of repair items cost (non-null)
    private Integer outstandingAmount;   // repairSubtotal - latest transaction finalAmount (never negative)
}



