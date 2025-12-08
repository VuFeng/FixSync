package com.fixsync.server.service;

import com.fixsync.server.dto.response.MediaResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface MediaService {
    MediaResponse uploadFile(MultipartFile file, MediaType mediaType, EntityType entityType, 
                            UUID entityId, String description, UUID uploadedById);
    
    Resource downloadFile(UUID mediaId);
    
    MediaResponse getMediaById(UUID id);
    
    List<MediaResponse> getMediaByEntity(EntityType entityType, UUID entityId);
    
    PageResponse<MediaResponse> getMediaByEntity(EntityType entityType, UUID entityId, Pageable pageable);
    
    List<MediaResponse> getMediaByEntityAndType(EntityType entityType, UUID entityId, MediaType mediaType);
    
    PageResponse<MediaResponse> getMediaByUploader(UUID uploadedById, Pageable pageable);
    
    PageResponse<MediaResponse> getAllMedia(Pageable pageable);
    
    void deleteMedia(UUID id);
    
    String getMediaUrl(UUID mediaId);
}


