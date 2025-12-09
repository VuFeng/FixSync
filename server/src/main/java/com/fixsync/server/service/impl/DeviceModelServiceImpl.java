package com.fixsync.server.service.impl;

import com.fixsync.server.dto.response.DeviceModelResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.Brand;
import com.fixsync.server.entity.DeviceModel;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.DeviceModelMapper;
import com.fixsync.server.repository.BrandRepository;
import com.fixsync.server.repository.DeviceModelRepository;
import com.fixsync.server.service.DeviceModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceModelServiceImpl implements DeviceModelService {
    
    private final DeviceModelRepository deviceModelRepository;
    private final BrandRepository brandRepository;
    private final DeviceModelMapper deviceModelMapper;
    
    @Override
    @Transactional(readOnly = true)
    public List<DeviceModelResponse> getModelsByBrandId(UUID brandId) {
        List<DeviceModel> models = deviceModelRepository.findByBrandIdAndIsActiveTrue(brandId);
        return deviceModelMapper.toResponseList(models);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<DeviceModelResponse> getModelsByBrandId(UUID brandId, Pageable pageable) {
        Page<DeviceModel> models = deviceModelRepository.findByBrandIdAndIsActiveTrue(brandId, pageable);
        
        return PageResponse.<DeviceModelResponse>builder()
                .content(deviceModelMapper.toResponseList(models.getContent()))
                .page(models.getNumber())
                .size(models.getSize())
                .totalElements(models.getTotalElements())
                .totalPages(models.getTotalPages())
                .first(models.isFirst())
                .last(models.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<DeviceModelResponse> getModelsByDeviceType(String deviceType) {
        List<DeviceModel> models = deviceModelRepository.findByDeviceTypeAndIsActiveTrue(deviceType);
        return deviceModelMapper.toResponseList(models);
    }
    
    @Override
    @Transactional(readOnly = true)
    public DeviceModelResponse getModelById(UUID id) {
        DeviceModel model = deviceModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Model", "id", id));
        return deviceModelMapper.toResponse(model);
    }

    @Override
    @Transactional
    public DeviceModelResponse createModel(UUID brandId, DeviceModelResponse request) {
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", brandId));
        DeviceModel entity = deviceModelMapper.toEntity(request);
        entity.setBrand(brand);
        entity = deviceModelRepository.save(entity);
        return deviceModelMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public DeviceModelResponse updateModel(UUID id, DeviceModelResponse request) {
        DeviceModel entity = deviceModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Model", "id", id));
        deviceModelMapper.updateEntity(entity, request);
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", request.getBrandId()));
            entity.setBrand(brand);
        }
        entity = deviceModelRepository.save(entity);
        return deviceModelMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void deleteModel(UUID id) {
        DeviceModel entity = deviceModelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Model", "id", id));
        deviceModelRepository.delete(entity);
    }
}

