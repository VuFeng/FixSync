package com.fixsync.server.dto.response;

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
public class WarrantyResponse {
    private UUID id;
    private UUID deviceId;
    private UUID repairItemId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String warrantyCode;
    private LocalDateTime createdAt;
}




