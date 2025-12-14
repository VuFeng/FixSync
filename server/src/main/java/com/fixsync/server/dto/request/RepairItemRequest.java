package com.fixsync.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairItemRequest {
    @NotNull(message = "ID thiết bị không được để trống")
    private UUID deviceId;

    // Optional: chỉ định phiên sửa chữa, nếu null sẽ lấy phiên mới nhất của device
    private UUID repairSessionId;

    private UUID serviceId;

    @Size(max = 255, message = "Tên dịch vụ không được vượt quá 255 ký tự")
    private String serviceName;

    @Size(max = 255, message = "Linh kiện sử dụng không được vượt quá 255 ký tự")
    private String partUsed;

    @PositiveOrZero(message = "Chi phí phải lớn hơn hoặc bằng 0")
    private Integer cost;

    private Integer warrantyMonths;

    private String description;
}




