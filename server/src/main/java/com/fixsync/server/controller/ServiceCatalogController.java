package com.fixsync.server.controller;

import com.fixsync.server.dto.request.ServiceCatalogRequest;
import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.ServiceCatalogResponse;
import com.fixsync.server.service.ServiceCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/service-catalog")
@RequiredArgsConstructor
public class ServiceCatalogController {

    private final ServiceCatalogService serviceCatalogService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<ServiceCatalogResponse>> create(@Valid @RequestBody ServiceCatalogRequest request) {
        ServiceCatalogResponse response = serviceCatalogService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo dịch vụ thành công", response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCatalogResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody ServiceCatalogRequest request) {
        ServiceCatalogResponse response = serviceCatalogService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật dịch vụ thành công", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceCatalogResponse>> getById(@PathVariable UUID id) {
        ServiceCatalogResponse response = serviceCatalogService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ServiceCatalogResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<ServiceCatalogResponse> response = serviceCatalogService.getAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ServiceCatalogResponse>>> getActive() {
        List<ServiceCatalogResponse> response = serviceCatalogService.getActive();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        serviceCatalogService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa dịch vụ thành công", null));
    }
}




