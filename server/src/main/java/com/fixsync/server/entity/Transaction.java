package com.fixsync.server.entity;

import com.fixsync.server.entity.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transactions", indexes = {
    @Index(name = "idx_transactions_device_id", columnList = "device_id"),
    @Index(name = "idx_transactions_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Transaction extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false, foreignKey = @ForeignKey(name = "fk_transactions_device"))
    private Device device;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repair_session_id", nullable = false, foreignKey = @ForeignKey(name = "fk_transactions_session"))
    private RepairSession repairSession;
    
    @Column(name = "total", nullable = false)
    private Integer total;
    
    @Column(name = "discount", nullable = false)
    private Integer discount = 0;
    
    @Column(name = "final_amount", nullable = false)
    private Integer finalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 50)
    private PaymentMethod paymentMethod;
}




