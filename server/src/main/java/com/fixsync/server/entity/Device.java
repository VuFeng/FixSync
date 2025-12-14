package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "devices", indexes = {
    @Index(name = "idx_devices_created_by", columnList = "created_by"),
    @Index(name = "idx_devices_customer_id", columnList = "customer_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device extends BaseEntity {
    
    // Customer relationship - nullable, device can exist without customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", foreignKey = @ForeignKey(name = "fk_devices_customer"))
    private Customer customer;
    
    // Legacy fields - kept for backward compatibility, nullable now
    // These will be populated from customer if customer exists, or can be set directly
    @Column(name = "customer_name", length = 255)
    private String customerName;
    
    @Column(name = "customer_phone", length = 20)
    private String customerPhone;
    
    @Column(name = "device_type", nullable = false, length = 100)
    private String deviceType; // iPhone, Android, etc.
    
    // Legacy fields - kept for backward compatibility, will be deprecated
    @Column(name = "brand", length = 100)
    private String brand;
    
    @Column(name = "model", length = 100)
    private String model;
    
    // New relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id", foreignKey = @ForeignKey(name = "fk_devices_brand"))
    private Brand brandEntity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id", foreignKey = @ForeignKey(name = "fk_devices_model"))
    private DeviceModel modelEntity;
    
    @Column(name = "imei", length = 50)
    private String imei;
    
    @Column(name = "color", length = 50)
    private String color;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_devices_created_by"))
    private User createdBy;
    
    @Column(name = "note", columnDefinition = "TEXT")
    private String note;
    
    // Relationships
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RepairItem> repairItems;
    
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;
    
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Warranty> warranties;

    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RepairSession> repairSessions;
    
    @OneToMany(mappedBy = "device", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RealtimeLog> logs;
}



