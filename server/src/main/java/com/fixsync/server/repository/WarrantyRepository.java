package com.fixsync.server.repository;

import com.fixsync.server.entity.Warranty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, UUID> {
    Optional<Warranty> findByWarrantyCode(String warrantyCode);
    
    List<Warranty> findByDeviceId(UUID deviceId);
    
    Page<Warranty> findByDeviceId(UUID deviceId, Pageable pageable);
    
    @Query("SELECT w FROM Warranty w WHERE w.endDate >= :startDate AND w.endDate <= :endDate")
    List<Warranty> findWarrantiesExpiringBetween(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT w FROM Warranty w WHERE w.endDate < :date")
    List<Warranty> findExpiredWarranties(@Param("date") LocalDateTime date);
}




