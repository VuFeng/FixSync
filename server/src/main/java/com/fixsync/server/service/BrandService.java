package com.fixsync.server.service;

import com.fixsync.server.dto.response.BrandResponse;
import com.fixsync.server.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface BrandService {
    List<BrandResponse> getAllActiveBrands();
    PageResponse<BrandResponse> getAllBrands(Pageable pageable);
    BrandResponse getBrandById(UUID id);
    BrandResponse createBrand(BrandResponse request);
    BrandResponse updateBrand(UUID id, BrandResponse request);
    void deleteBrand(UUID id);
}


