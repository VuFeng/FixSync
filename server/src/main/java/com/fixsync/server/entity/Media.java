package com.fixsync.server.entity;

import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "media", indexes = {
    @Index(name = "idx_media_entity_type_id", columnList = "entity_type, entity_id"),
    @Index(name = "idx_media_uploaded_by", columnList = "uploaded_by"),
    @Index(name = "idx_media_media_type", columnList = "media_type"),
    @Index(name = "idx_media_is_active", columnList = "is_active"),
    @Index(name = "idx_media_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Media extends BaseEntity {
    
    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;
    
    @Column(name = "stored_filename", nullable = false, unique = true, length = 255)
    private String storedFilename;
    
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;
    
    @Column(name = "file_size", nullable = false)
    private Long fileSize;
    
    @Column(name = "content_type", nullable = false, length = 100)
    private String contentType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false, length = 50)
    private MediaType mediaType;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", length = 50)
    private EntityType entityType;
    
    @Column(name = "entity_id")
    private UUID entityId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false, foreignKey = @ForeignKey(name = "fk_media_uploaded_by"))
    private User uploadedBy;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}


