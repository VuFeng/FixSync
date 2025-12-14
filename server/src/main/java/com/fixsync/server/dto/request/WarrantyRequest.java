package com.fixsync.server.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyRequest {
    @NotNull(message = "ID thiết bị không được để trống")
    private UUID deviceId;

    // Optional: chỉ định phiên sửa chữa, nếu null sẽ lấy phiên mới nhất của device
    private UUID repairSessionId;
    
    private UUID repairItemId; // Optional - null nếu là bảo hành tổng cho thiết bị
    
    @NotNull(message = "Số tháng bảo hành không được để trống")
    @Positive(message = "Số tháng bảo hành phải lớn hơn 0")
    private Integer warrantyMonths;
}


