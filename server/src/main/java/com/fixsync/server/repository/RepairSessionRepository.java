package com.fixsync.server.repository;

import com.fixsync.server.entity.RepairSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RepairSessionRepository extends JpaRepository<RepairSession, UUID> {

    @EntityGraph(attributePaths = {"device", "device.brandEntity", "device.modelEntity", "device.customer", "assignedTo", "createdBy"})
    Optional<RepairSession> findTopByDeviceIdOrderByCreatedAtDesc(UUID deviceId);

    @EntityGraph(attributePaths = {"device", "device.brandEntity", "device.modelEntity", "device.customer", "assignedTo", "createdBy"})
    Page<RepairSession> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"device", "device.brandEntity", "device.modelEntity", "device.customer", "assignedTo", "createdBy"})
    Page<RepairSession> findByDeviceId(UUID deviceId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"device", "device.brandEntity", "device.modelEntity", "device.customer", "assignedTo", "createdBy"})
    Optional<RepairSession> findById(UUID id);
}

