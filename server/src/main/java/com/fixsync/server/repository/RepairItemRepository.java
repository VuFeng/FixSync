package com.fixsync.server.repository;

import com.fixsync.server.entity.RepairItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RepairItemRepository extends JpaRepository<RepairItem, UUID> {
    List<RepairItem> findByDeviceId(UUID deviceId);
    
    Page<RepairItem> findByDeviceId(UUID deviceId, Pageable pageable);
    
    @Query("SELECT SUM(ri.cost) FROM RepairItem ri WHERE ri.device.id = :deviceId")
    Integer sumCostByDeviceId(@Param("deviceId") UUID deviceId);
}




