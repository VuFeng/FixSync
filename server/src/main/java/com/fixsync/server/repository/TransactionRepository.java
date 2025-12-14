package com.fixsync.server.repository;

import com.fixsync.server.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    Optional<Transaction> findByDeviceId(UUID deviceId);
    
    Page<Transaction> findByDeviceId(UUID deviceId, Pageable pageable);

    Optional<Transaction> findByRepairSessionId(UUID repairSessionId);

    Optional<Transaction> findTopByDeviceIdOrderByCreatedAtDesc(UUID deviceId);
    
    @Query("SELECT SUM(t.finalAmount) FROM Transaction t WHERE " +
           "t.createdAt >= :startDate AND t.createdAt <= :endDate")
    Long sumFinalAmountByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}




