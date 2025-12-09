package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.ServiceCatalogRequest;
import com.fixsync.server.dto.response.ServiceCatalogResponse;
import com.fixsync.server.entity.ServiceCatalog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ServiceCatalogMapper {

    ServiceCatalogResponse toResponse(ServiceCatalog serviceCatalog);

    List<ServiceCatalogResponse> toResponseList(List<ServiceCatalog> entities);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    ServiceCatalog toEntity(ServiceCatalogRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    void updateEntity(@MappingTarget ServiceCatalog entity, ServiceCatalogRequest request);
}




