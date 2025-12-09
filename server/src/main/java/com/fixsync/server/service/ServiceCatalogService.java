package com.fixsync.server.service;

import com.fixsync.server.dto.request.ServiceCatalogRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.ServiceCatalogResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ServiceCatalogService {
    ServiceCatalogResponse create(ServiceCatalogRequest request);
    ServiceCatalogResponse update(UUID id, ServiceCatalogRequest request);
    ServiceCatalogResponse getById(UUID id);
    PageResponse<ServiceCatalogResponse> getAll(Pageable pageable);
    List<ServiceCatalogResponse> getActive();
    void delete(UUID id);
}




