package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "repair_items", indexes = {
    @Index(name = "idx_repair_items_device_id", columnList = "device_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepairItem extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false, foreignKey = @ForeignKey(name = "fk_repair_items_device"))
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_session_id", nullable = false, foreignKey = @ForeignKey(name = "fk_repair_items_session"))
    private RepairSession repairSession;
    
    @Column(name = "service_name", nullable = false, length = 255)
    private String serviceName;
    
    @Column(name = "part_used", length = 255)
    private String partUsed;
    
    @Column(name = "cost", nullable = false)
    private Integer cost;
    
    @Column(name = "warranty_months")
    private Integer warrantyMonths;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", foreignKey = @ForeignKey(name = "fk_repair_items_service_catalog"))
    private ServiceCatalog serviceCatalog;
    
    // Relationships
    @OneToMany(mappedBy = "repairItem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Warranty> warranties;
}




