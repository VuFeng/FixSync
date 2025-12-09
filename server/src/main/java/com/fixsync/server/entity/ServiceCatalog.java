package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "service_catalog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCatalog extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true, length = 255)
    private String name;

    @Column(name = "default_part_used", length = 255)
    private String defaultPartUsed;

    @Column(name = "base_cost", nullable = false)
    private Integer baseCost;

    @Column(name = "default_warranty_months")
    private Integer defaultWarrantyMonths;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}




