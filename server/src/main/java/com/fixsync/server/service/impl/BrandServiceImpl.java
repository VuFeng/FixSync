package com.fixsync.server.service.impl;

import com.fixsync.server.dto.response.BrandResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.Brand;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.BrandMapper;
import com.fixsync.server.repository.BrandRepository;
import com.fixsync.server.service.BrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BrandServiceImpl implements BrandService {
    
    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<BrandResponse> getAllActiveBrands() {
        List<Brand> brands = brandRepository.findByIsActiveTrue(Pageable.unpaged()).getContent();
        return brandMapper.toResponseList(brands);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<BrandResponse> getAllBrands(Pageable pageable) {
        Page<Brand> brands = brandRepository.findAll(pageable);
        
        return PageResponse.<BrandResponse>builder()
                .content(brandMapper.toResponseList(brands.getContent()))
                .page(brands.getNumber())
                .size(brands.getSize())
                .totalElements(brands.getTotalElements())
                .totalPages(brands.getTotalPages())
                .first(brands.isFirst())
                .last(brands.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public BrandResponse getBrandById(UUID id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", id));
        return brandMapper.toResponse(brand);
    }
}


