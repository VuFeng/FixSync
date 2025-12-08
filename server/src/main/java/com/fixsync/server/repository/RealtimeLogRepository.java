package com.fixsync.server.repository;

import com.fixsync.server.entity.RealtimeLog;
import com.fixsync.server.entity.enums.ActionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RealtimeLogRepository extends JpaRepository<RealtimeLog, UUID> {
    List<RealtimeLog> findByDeviceIdOrderByCreatedAtDesc(UUID deviceId);
    
    @EntityGraph(attributePaths = {"createdBy"})
    Page<RealtimeLog> findByDeviceId(UUID deviceId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"createdBy"})
    Page<RealtimeLog> findByDeviceIdAndAction(UUID deviceId, ActionType action, Pageable pageable);
}



