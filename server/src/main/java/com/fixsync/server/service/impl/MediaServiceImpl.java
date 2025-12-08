package com.fixsync.server.service.impl;

import com.fixsync.server.config.FileStorageConfig;
import com.fixsync.server.dto.response.MediaResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.Media;
import com.fixsync.server.entity.User;
import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import com.fixsync.server.exception.BadRequestException;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.MediaMapper;
import com.fixsync.server.repository.MediaRepository;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.MediaService;
import com.fixsync.server.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {
    
    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final MediaMapper mediaMapper;
    private final FileStorageConfig fileStorageConfig;
    
    @Autowired(required = false)
    private S3Service s3Service;
    
    private Path fileStorageLocation;
    
    @PostConstruct
    public void init() {
        if (!fileStorageConfig.isS3Storage()) {
            this.fileStorageLocation = fileStorageConfig.getUploadPath();
            try {
                Files.createDirectories(this.fileStorageLocation);
            } catch (Exception ex) {
                throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
            }
        }
    }
    
    @Override
    @Transactional
    public MediaResponse uploadFile(MultipartFile file, MediaType mediaType, EntityType entityType,
                                   UUID entityId, String description, UUID uploadedById) {
        // Validate file
        if (file.isEmpty()) {
            throw new BadRequestException("File không được để trống");
        }
        
        if (file.getSize() > fileStorageConfig.getMaxSize()) {
            throw new BadRequestException("File quá lớn. Kích thước tối đa: " + 
                    (fileStorageConfig.getMaxSize() / 1024 / 1024) + "MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !fileStorageConfig.getAllowedTypes().contains(contentType)) {
            throw new BadRequestException("Loại file không được phép. Chỉ chấp nhận: " + 
                    String.join(", ", fileStorageConfig.getAllowedTypes()));
        }
        
        // Get user
        User uploadedBy = userRepository.findById(uploadedById)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", uploadedById));
        
        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            fileExtension = originalFilename.substring(lastDotIndex);
        }
        
        String storedFilename = UUID.randomUUID().toString() + fileExtension;
        String filePath;
        
        // Upload to S3 or local storage
        if (fileStorageConfig.isS3Storage()) {
            if (s3Service == null) {
                throw new RuntimeException("S3Service is not configured. Please check your S3 configuration.");
            }
            // Upload to S3
            String s3Key = generateS3Key(entityType, entityId, storedFilename);
            s3Service.uploadFile(s3Key, file, contentType);
            filePath = s3Key; // Store S3 key as filePath
        } else {
            // Upload to local storage
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            try {
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
            }
            filePath = targetLocation.toString();
        }
        
        // Create media entity
        Media media = new Media();
        media.setOriginalFilename(originalFilename);
        media.setStoredFilename(storedFilename);
        media.setFilePath(filePath);
        media.setFileSize(file.getSize());
        media.setContentType(contentType);
        media.setMediaType(mediaType);
        media.setEntityType(entityType);
        media.setEntityId(entityId);
        media.setUploadedBy(uploadedBy);
        media.setDescription(description);
        media.setIsActive(true);
        
        media = mediaRepository.save(media);
        
        MediaResponse response = mediaMapper.toResponse(media);
        response.setUrl(getMediaUrl(media.getId()));
        
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Resource downloadFile(UUID mediaId) {
        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", mediaId));
        
        if (!media.getIsActive()) {
            throw new BadRequestException("File đã bị xóa");
        }
        
        if (fileStorageConfig.isS3Storage()) {
            if (s3Service == null) {
                throw new RuntimeException("S3Service is not configured. Please check your S3 configuration.");
            }
            // Download from S3
            InputStream inputStream = s3Service.downloadFile(media.getFilePath());
            return new InputStreamResource(inputStream);
        } else {
            // Download from local storage
            try {
                Path filePath = Paths.get(media.getFilePath()).normalize();
                Resource resource = new UrlResource(filePath.toUri());
                
                if (resource.exists() && resource.isReadable()) {
                    return resource;
                } else {
                    throw new ResourceNotFoundException("File", "path", media.getFilePath());
                }
            } catch (MalformedURLException ex) {
                throw new ResourceNotFoundException("File", "id", mediaId);
            }
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public MediaResponse getMediaById(UUID id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", id));
        
        MediaResponse response = mediaMapper.toResponse(media);
        response.setUrl(getMediaUrl(id));
        
        return response;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getMediaByEntity(EntityType entityType, UUID entityId) {
        List<Media> mediaList = mediaRepository.findByEntityTypeAndEntityId(entityType, entityId);
        return mediaList.stream()
                .map(media -> {
                    MediaResponse response = mediaMapper.toResponse(media);
                    response.setUrl(getMediaUrl(media.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<MediaResponse> getMediaByEntity(EntityType entityType, UUID entityId, Pageable pageable) {
        Page<Media> mediaPage = mediaRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable);
        
        List<MediaResponse> content = mediaPage.getContent().stream()
                .map(media -> {
                    MediaResponse response = mediaMapper.toResponse(media);
                    response.setUrl(getMediaUrl(media.getId()));
                    return response;
                })
                .collect(Collectors.toList());
        
        return PageResponse.<MediaResponse>builder()
                .content(content)
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .first(mediaPage.isFirst())
                .last(mediaPage.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MediaResponse> getMediaByEntityAndType(EntityType entityType, UUID entityId, MediaType mediaType) {
        List<Media> mediaList = mediaRepository.findByEntityTypeAndEntityIdAndMediaType(entityType, entityId, mediaType);
        return mediaList.stream()
                .map(media -> {
                    MediaResponse response = mediaMapper.toResponse(media);
                    response.setUrl(getMediaUrl(media.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<MediaResponse> getMediaByUploader(UUID uploadedById, Pageable pageable) {
        Page<Media> mediaPage = mediaRepository.findByUploadedBy(uploadedById, pageable);
        
        List<MediaResponse> content = mediaPage.getContent().stream()
                .map(media -> {
                    MediaResponse response = mediaMapper.toResponse(media);
                    response.setUrl(getMediaUrl(media.getId()));
                    return response;
                })
                .collect(Collectors.toList());
        
        return PageResponse.<MediaResponse>builder()
                .content(content)
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .first(mediaPage.isFirst())
                .last(mediaPage.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<MediaResponse> getAllMedia(Pageable pageable) {
        Page<Media> mediaPage = mediaRepository.findByIsActiveTrue(pageable);
        
        List<MediaResponse> content = mediaPage.getContent().stream()
                .map(media -> {
                    MediaResponse response = mediaMapper.toResponse(media);
                    response.setUrl(getMediaUrl(media.getId()));
                    return response;
                })
                .collect(Collectors.toList());
        
        return PageResponse.<MediaResponse>builder()
                .content(content)
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .first(mediaPage.isFirst())
                .last(mediaPage.isLast())
                .build();
    }
    
    @Override
    @Transactional
    public void deleteMedia(UUID id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File", "id", id));
        
        // Soft delete - set isActive = false
        media.setIsActive(false);
        mediaRepository.save(media);
        
        // Delete physical file
        if (fileStorageConfig.isS3Storage()) {
            if (s3Service != null) {
                // Delete from S3
                try {
                    s3Service.deleteFile(media.getFilePath());
                } catch (Exception ex) {
                    log.warn("Could not delete file from S3: " + media.getFilePath(), ex);
                }
            }
        } else {
            // Delete from local storage
            try {
                Path filePath = Paths.get(media.getFilePath());
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                }
            } catch (IOException ex) {
                log.warn("Could not delete file: " + media.getFilePath(), ex);
            }
        }
    }
    
    @Override
    public String getMediaUrl(UUID mediaId) {
        if (fileStorageConfig.isS3Storage() && s3Service != null) {
            Media media = mediaRepository.findById(mediaId).orElse(null);
            if (media != null) {
                // Return S3 URL or presigned URL
                return s3Service.getFileUrl(media.getFilePath());
            }
        }
        return "/api/media/" + mediaId + "/download";
    }
    
    private String generateS3Key(EntityType entityType, UUID entityId, String filename) {
        // Generate S3 key: entityType/entityId/filename
        // Example: DEVICE/123e4567-e89b-12d3-a456-426614174000/abc123.jpg
        if (entityType != null && entityId != null) {
            return String.format("%s/%s/%s", entityType.name(), entityId, filename);
        }
        return String.format("other/%s", filename);
    }
}

