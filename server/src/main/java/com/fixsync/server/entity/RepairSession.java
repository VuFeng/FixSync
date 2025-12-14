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
@Table(name = "repair_sessions", indexes = {
        @Index(name = "idx_repair_sessions_device_id", columnList = "device_id"),
        @Index(name = "idx_repair_sessions_status", columnList = "status"),
        @Index(name = "idx_repair_sessions_assigned_to", columnList = "assigned_to")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RepairSession extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false, foreignKey = @ForeignKey(name = "fk_repair_sessions_device"))
    private Device device;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private DeviceStatus status = DeviceStatus.RECEIVED;

    @Column(name = "received_date", nullable = false)
    private LocalDateTime receivedDate = LocalDateTime.now();

    @Column(name = "expected_return_date")
    private LocalDateTime expectedReturnDate;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to", foreignKey = @ForeignKey(name = "fk_repair_sessions_assigned_to"))
    private User assignedTo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_repair_sessions_created_by"))
    private User createdBy;

    @OneToMany(mappedBy = "repairSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RepairItem> repairItems;

    @OneToMany(mappedBy = "repairSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    @OneToMany(mappedBy = "repairSession", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Warranty> warranties;
}







