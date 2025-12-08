package com.fixsync.server.entity;

import com.fixsync.server.entity.enums.ActionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "realtime_logs", indexes = {
    @Index(name = "idx_realtime_logs_device_id", columnList = "device_id"),
    @Index(name = "idx_realtime_logs_created_by", columnList = "created_by"),
    @Index(name = "idx_realtime_logs_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RealtimeLog extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", nullable = false, foreignKey = @ForeignKey(name = "fk_realtime_logs_device"))
    private Device device;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false, length = 50)
    private ActionType action;
    
    @Column(name = "detail", columnDefinition = "TEXT")
    private String detail;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false, foreignKey = @ForeignKey(name = "fk_realtime_logs_created_by"))
    private User createdBy;
}




