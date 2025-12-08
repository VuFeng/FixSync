package com.fixsync.server.repository;

import com.fixsync.server.entity.DeviceModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeviceModelRepository extends JpaRepository<DeviceModel, UUID> {
    List<DeviceModel> findByBrandIdAndIsActiveTrue(UUID brandId);
    
    Page<DeviceModel> findByBrandIdAndIsActiveTrue(UUID brandId, Pageable pageable);
    
    Optional<DeviceModel> findByBrandIdAndName(UUID brandId, String name);
    
    List<DeviceModel> findByDeviceTypeAndIsActiveTrue(String deviceType);
}

