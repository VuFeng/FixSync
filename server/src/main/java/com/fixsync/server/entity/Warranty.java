package com.fixsync.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "warranties", indexes = {
    @Index(name = "idx_warranties_device_id", columnList = "device_id"),
    @Index(name = "idx_warranties_warranty_code", columnList = "warranty_code"),
    @Index(name = "idx_warranties_end_date", columnList = "end_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Warranty extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false, foreignKey = @ForeignKey(name = "fk_warranties_device"))
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_session_id", nullable = false, foreignKey = @ForeignKey(name = "fk_warranties_session"))
    private RepairSession repairSession;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_item_id", foreignKey = @ForeignKey(name = "fk_warranties_repair_item"))
    private RepairItem repairItem;
    
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;
    
    @Column(name = "warranty_code", nullable = false, unique = true, length = 50)
    private String warrantyCode;
}




