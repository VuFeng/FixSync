package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "brands", indexes = {
    @Index(name = "idx_brands_name", columnList = "name"),
    @Index(name = "idx_brands_is_active", columnList = "is_active")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Brand extends BaseEntity {
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Relationships
    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DeviceModel> models;
}

