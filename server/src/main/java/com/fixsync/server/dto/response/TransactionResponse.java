package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private UUID id;
    private UUID deviceId;
    private Integer total;
    private Integer discount;
    private Integer finalAmount;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
}




