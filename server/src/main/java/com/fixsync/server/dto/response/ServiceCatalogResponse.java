package com.fixsync.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCatalogResponse {
    private UUID id;
    private String name;
    private String defaultPartUsed;
    private Integer baseCost;
    private Integer defaultWarrantyMonths;
    private String description;
    private Boolean isActive;
}




