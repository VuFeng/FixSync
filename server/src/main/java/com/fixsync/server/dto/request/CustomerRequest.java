package com.fixsync.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequest {
    @NotBlank(message = "Tên khách hàng không được để trống")
    @Size(max = 255, message = "Tên khách hàng không được vượt quá 255 ký tự")
    private String name;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    private String phone;
    
    @Size(max = 255, message = "Email không được vượt quá 255 ký tự")
    private String email;
    
    @Size(max = 1000, message = "Địa chỉ không được vượt quá 1000 ký tự")
    private String address;
    
    private String note;
}







