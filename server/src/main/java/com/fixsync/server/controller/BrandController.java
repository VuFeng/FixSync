package com.fixsync.server.controller;

import com.fixsync.server.dto.response.ApiResponse;
import com.fixsync.server.dto.response.BrandResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/brands")
@RequiredArgsConstructor
public class BrandController {
    
    private final BrandService brandService;
    
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BrandResponse>>> getActiveBrands() {
        List<BrandResponse> brands = brandService.getAllActiveBrands();
        return ResponseEntity.ok(ApiResponse.success(brands));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BrandResponse>>> getAllBrands(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("DESC") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<BrandResponse> response = brandService.getAllBrands(pageable);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandResponse>> getBrandById(@PathVariable UUID id) {
        BrandResponse response = brandService.getBrandById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}


