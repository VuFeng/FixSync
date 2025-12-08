package com.fixsync.server.repository;

import com.fixsync.server.entity.Media;
import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MediaRepository extends JpaRepository<Media, UUID> {
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Optional<Media> findById(UUID id);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Optional<Media> findByStoredFilename(String storedFilename);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    List<Media> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Page<Media> findByEntityTypeAndEntityId(EntityType entityType, UUID entityId, Pageable pageable);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    List<Media> findByEntityTypeAndEntityIdAndMediaType(EntityType entityType, UUID entityId, MediaType mediaType);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Page<Media> findByUploadedBy(UUID uploadedById, Pageable pageable);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Page<Media> findByMediaType(MediaType mediaType, Pageable pageable);
    
    @EntityGraph(attributePaths = {"uploadedBy"})
    Page<Media> findByIsActiveTrue(Pageable pageable);
}


