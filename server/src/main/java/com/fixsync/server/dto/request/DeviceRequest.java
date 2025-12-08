package com.fixsync.server.dto.request;

import com.fixsync.server.entity.enums.DeviceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceRequest {
    @NotBlank(message = "Tên khách hàng không được để trống")
    @Size(max = 255, message = "Tên khách hàng không được vượt quá 255 ký tự")
    private String customerName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    private String customerPhone;
    
    // deviceType will be automatically set from model, but can be overridden if needed
    @Size(max = 100, message = "Loại thiết bị không được vượt quá 100 ký tự")
    private String deviceType;
    
    // New fields - preferred way
    @NotNull(message = "ID hãng không được để trống")
    private UUID brandId;
    
    @NotNull(message = "ID model không được để trống")
    private UUID modelId;
    
    // Legacy fields - kept for backward compatibility, will be deprecated
    @Size(max = 100, message = "Hãng không được vượt quá 100 ký tự")
    private String brand;
    
    @Size(max = 100, message = "Model không được vượt quá 100 ký tự")
    private String model;
    
    @Size(max = 50, message = "IMEI không được vượt quá 50 ký tự")
    private String imei;
    
    @Size(max = 50, message = "Màu sắc không được vượt quá 50 ký tự")
    private String color;
    
    @NotNull(message = "Ngày tiếp nhận không được để trống")
    private LocalDateTime receivedDate;
    
    private LocalDateTime expectedReturnDate;
    
    private Integer warrantyMonths;
    
    private UUID assignedTo;
    
    private DeviceStatus status;
    
    private String note;
}



