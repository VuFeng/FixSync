package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "device_models", indexes = {
    @Index(name = "idx_device_models_brand_id", columnList = "brand_id"),
    @Index(name = "idx_device_models_name", columnList = "name"),
    @Index(name = "idx_device_models_device_type", columnList = "device_type"),
    @Index(name = "idx_device_models_is_active", columnList = "is_active")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_device_models_brand_name", columnNames = {"brand_id", "name"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeviceModel extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", nullable = false, foreignKey = @ForeignKey(name = "fk_device_models_brand"))
    private Brand brand;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "device_type", nullable = false, length = 100)
    private String deviceType; // iPhone, Android, etc.
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}

