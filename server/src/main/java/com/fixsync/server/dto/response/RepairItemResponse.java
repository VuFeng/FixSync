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
public class RepairItemResponse {
    private UUID id;
    private UUID deviceId;
    private String serviceName;
    private String partUsed;
    private Integer cost;
    private Integer warrantyMonths;
    private String description;
    private LocalDateTime createdAt;
}




