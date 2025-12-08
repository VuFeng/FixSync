package com.fixsync.server.controller;

import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.MediaResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.enums.EntityType;
import com.fixsync.server.entity.enums.MediaType;
import com.fixsync.server.service.MediaService;
import com.fixsync.server.service.UserContextService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    
    private final MediaService mediaService;
    private final UserContextService userContextService;
    
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MediaResponse>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("mediaType") MediaType mediaType,
            @RequestParam(required = false) EntityType entityType,
            @RequestParam(required = false) UUID entityId,
            @RequestParam(required = false) String description) {
        
        UUID uploadedById = userContextService.getCurrentUserId();
        MediaResponse response = mediaService.uploadFile(file, mediaType, entityType, entityId, description, uploadedById);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Upload file thành công", response));
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id) {
        Resource resource = mediaService.downloadFile(id);
        MediaResponse media = mediaService.getMediaById(id);
        
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(media.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + media.getOriginalFilename() + "\"")
                .body(resource);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MediaResponse>> getMediaById(@PathVariable UUID id) {
        MediaResponse response = mediaService.getMediaById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<?>> getMediaByEntity(
            @PathVariable EntityType entityType,
            @PathVariable UUID entityId,
            @RequestParam(required = false, defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        if (paginated) {
            Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
            Pageable pageable = PageRequest.of(page, size, sort);
            PageResponse<MediaResponse> response = mediaService.getMediaByEntity(entityType, entityId, pageable);
            return ResponseEntity.ok(ApiResponse.success(response));
        } else {
            List<MediaResponse> response = mediaService.getMediaByEntity(entityType, entityId);
            return ResponseEntity.ok(ApiResponse.success(response));
        }
    }
    
    @GetMapping("/entity/{entityType}/{entityId}/type/{mediaType}")
    public ResponseEntity<ApiResponse<List<MediaResponse>>> getMediaByEntityAndType(
            @PathVariable EntityType entityType,
            @PathVariable UUID entityId,
            @PathVariable MediaType mediaType) {
        
        List<MediaResponse> response = mediaService.getMediaByEntityAndType(entityType, entityId, mediaType);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/my-uploads")
    public ResponseEntity<ApiResponse<PageResponse<MediaResponse>>> getMyUploads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        UUID uploadedById = userContextService.getCurrentUserId();
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<MediaResponse> response = mediaService.getMediaByUploader(uploadedById, pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<MediaResponse>>> getAllMedia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<MediaResponse> response = mediaService.getAllMedia(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMedia(@PathVariable UUID id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa file thành công", null));
    }
}

