package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.ServiceCatalogRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.ServiceCatalogResponse;
import com.fixsync.server.entity.ServiceCatalog;
import com.fixsync.server.exception.BadRequestException;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.ServiceCatalogMapper;
import com.fixsync.server.repository.ServiceCatalogRepository;
import com.fixsync.server.service.ServiceCatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceCatalogServiceImpl implements ServiceCatalogService {

    private final ServiceCatalogRepository repository;
    private final ServiceCatalogMapper mapper;

    @Override
    @Transactional
    public ServiceCatalogResponse create(ServiceCatalogRequest request) {
        repository.findByNameIgnoreCase(request.getName()).ifPresent(s -> {
            throw new BadRequestException("Tên dịch vụ đã tồn tại");
        });
        ServiceCatalog entity = mapper.toEntity(request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional
    public ServiceCatalogResponse update(UUID id, ServiceCatalogRequest request) {
        ServiceCatalog entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));

        repository.findByNameIgnoreCase(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("Tên dịch vụ đã tồn tại");
            }
        });

        mapper.updateEntity(entity, request);
        entity = repository.save(entity);
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceCatalogResponse getById(UUID id) {
        ServiceCatalog entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));
        return mapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceCatalogResponse> getAll(Pageable pageable) {
        Page<ServiceCatalog> page = repository.findAll(pageable);
        return PageResponse.<ServiceCatalogResponse>builder()
                .content(mapper.toResponseList(page.getContent()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceCatalogResponse> getActive() {
        return mapper.toResponseList(repository.findByIsActiveTrue());
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        ServiceCatalog entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ", "id", id));
        repository.delete(entity);
    }
}




