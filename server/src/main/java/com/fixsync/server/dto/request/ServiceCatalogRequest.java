package com.fixsync.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCatalogRequest {

    @NotBlank(message = "Tên dịch vụ không được để trống")
    @Size(max = 255, message = "Tên dịch vụ không được vượt quá 255 ký tự")
    private String name;

    @Size(max = 255, message = "Linh kiện mặc định không được vượt quá 255 ký tự")
    private String defaultPartUsed;

    @PositiveOrZero(message = "Chi phí phải lớn hơn hoặc bằng 0")
    private Integer baseCost;

    private Integer defaultWarrantyMonths;

    private String description;

    private Boolean isActive = true;
}




