package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaResponse {
    private UUID id;
    private String originalFilename;
    private String storedFilename;
    private String filePath;
    private String url; // Full URL để download
    private Long fileSize;
    private String contentType;
    private MediaType mediaType;
    private EntityType entityType;
    private UUID entityId;
    private UserResponse uploadedBy;
    private String description;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}


