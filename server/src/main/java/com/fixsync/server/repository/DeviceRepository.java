package com.fixsync.server.repository;

import com.fixsync.server.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceRepository extends JpaRepository<Device, UUID> {
    
    @EntityGraph(attributePaths = {"createdBy", "customer", "brandEntity", "modelEntity"})
    Optional<Device> findById(UUID id);
    
    @EntityGraph(attributePaths = {"createdBy", "customer", "brandEntity", "modelEntity"})
    Page<Device> findAll(Pageable pageable);
}



