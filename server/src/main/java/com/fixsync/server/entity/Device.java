package com.fixsync.server.entity;

import com.fixsync.server.entity.enums.DeviceStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "devices", indexes = {
    @Index(name = "idx_devices_status", columnList = "status"),
    @Index(name = "idx_devices_created_by", columnList = "created_by"),
    @Index(name = "idx_devices_assigned_to", columnList = "assigned_to"),
    @Index(name = "idx_devices_received_date", columnList = "received_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device extends BaseEntity {
    
    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;
    
    @Column(name = "customer_phone", nullable = false, length = 20)
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
    
    @Column(name = "received_date", nullable = false)
    private LocalDateTime receivedDate;
    
    @Column(name = "expected_return_date")
    private LocalDateTime expectedReturnDate;
    
    @Column(name = "warranty_months")
    private Integer warrantyMonths;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_devices_created_by"))
    private User createdBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", foreignKey = @ForeignKey(name = "fk_devices_assigned_to"))
    private User assignedTo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private DeviceStatus status = DeviceStatus.RECEIVED;
    
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
    private List<RealtimeLog> logs;
}



