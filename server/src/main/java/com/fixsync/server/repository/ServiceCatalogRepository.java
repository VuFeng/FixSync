package com.fixsync.server.repository;

import com.fixsync.server.entity.ServiceCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceCatalogRepository extends JpaRepository<ServiceCatalog, UUID> {
    Optional<ServiceCatalog> findByNameIgnoreCase(String name);
    List<ServiceCatalog> findByIsActiveTrue();
}




