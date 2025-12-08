package com.fixsync.server.dto.request;

import com.fixsync.server.entity.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {
    @NotNull(message = "ID thiết bị không được để trống")
    private UUID deviceId;
    
    @NotNull(message = "Tổng tiền không được để trống")
    @PositiveOrZero(message = "Tổng tiền phải lớn hơn hoặc bằng 0")
    private Integer total;
    
    @NotNull(message = "Giảm giá không được để trống")
    @PositiveOrZero(message = "Giảm giá phải lớn hơn hoặc bằng 0")
    private Integer discount = 0;
    
    @NotNull(message = "Phương thức thanh toán không được để trống")
    private PaymentMethod paymentMethod;
}




