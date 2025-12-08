package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.BrandResponse;
import com.fixsync.server.entity.Brand;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    BrandResponse toResponse(Brand brand);
    
    List<BrandResponse> toResponseList(List<Brand> brands);
}

