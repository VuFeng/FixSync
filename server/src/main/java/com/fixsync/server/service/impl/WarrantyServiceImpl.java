package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.WarrantyRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.WarrantyResponse;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.RepairItem;
import com.fixsync.server.entity.Warranty;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.WarrantyMapper;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.RepairItemRepository;
import com.fixsync.server.repository.RepairSessionRepository;
import com.fixsync.server.repository.WarrantyRepository;
import com.fixsync.server.service.WarrantyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarrantyServiceImpl implements WarrantyService {
    
    private final WarrantyRepository warrantyRepository;
    private final DeviceRepository deviceRepository;
    private final RepairItemRepository repairItemRepository;
    private final RepairSessionRepository repairSessionRepository;
    private final WarrantyMapper warrantyMapper;
    
    @Override
    @Transactional
    public WarrantyResponse createWarranty(WarrantyRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
        
        RepairItem repairItem = null;
        if (request.getRepairItemId() != null) {
            repairItem = repairItemRepository.findById(request.getRepairItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ sửa chữa", "id", request.getRepairItemId()));
        }
        
        var session = request.getRepairSessionId() != null
                ? repairSessionRepository.findById(request.getRepairSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "id", request.getRepairSessionId()))
                : repairSessionRepository.findTopByDeviceIdOrderByCreatedAtDesc(device.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "deviceId", device.getId()));
        
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = startDate.plusMonths(request.getWarrantyMonths());
        
        Warranty warranty = new Warranty();
        warranty.setDevice(device);
        warranty.setRepairSession(session);
        warranty.setRepairItem(repairItem);
        warranty.setStartDate(startDate);
        warranty.setEndDate(endDate);
        warranty.setWarrantyCode(generateWarrantyCode());
        
        warranty = warrantyRepository.save(warranty);
        
        return warrantyMapper.toResponse(warranty);
    }
    
    @Override
    @Transactional
    public WarrantyResponse updateWarranty(UUID id, WarrantyRequest request) {
        Warranty warranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bảo hành", "id", id));
        
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
        
        RepairItem repairItem = null;
        if (request.getRepairItemId() != null) {
            repairItem = repairItemRepository.findById(request.getRepairItemId())
                    .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ sửa chữa", "id", request.getRepairItemId()));
        }

        var session = request.getRepairSessionId() != null
                ? repairSessionRepository.findById(request.getRepairSessionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "id", request.getRepairSessionId()))
                : repairSessionRepository.findTopByDeviceIdOrderByCreatedAtDesc(device.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "deviceId", device.getId()));
        
        // Cập nhật thông tin
        warranty.setDevice(device);
        warranty.setRepairSession(session);
        warranty.setRepairItem(repairItem);
        
        // Tính lại endDate dựa trên warrantyMonths mới
        LocalDateTime startDate = warranty.getStartDate(); // Giữ nguyên startDate
        LocalDateTime endDate = startDate.plusMonths(request.getWarrantyMonths());
        warranty.setEndDate(endDate);
        
        warranty = warrantyRepository.save(warranty);
        
        return warrantyMapper.toResponse(warranty);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WarrantyResponse getWarrantyById(UUID id) {
        Warranty warranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bảo hành", "id", id));
        return warrantyMapper.toResponse(warranty);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WarrantyResponse getWarrantyByCode(String warrantyCode) {
        Warranty warranty = warrantyRepository.findByWarrantyCode(warrantyCode)
                .orElseThrow(() -> new ResourceNotFoundException("Bảo hành", "mã bảo hành", warrantyCode));
        return warrantyMapper.toResponse(warranty);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WarrantyResponse> getWarrantiesByDeviceId(UUID deviceId) {
        List<Warranty> warranties = warrantyRepository.findByDeviceId(deviceId);
        return warranties.stream()
                .map(warrantyMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<WarrantyResponse> getWarrantiesByDeviceId(UUID deviceId, Pageable pageable) {
        Page<Warranty> warranties = warrantyRepository.findByDeviceId(deviceId, pageable);
        
        return PageResponse.<WarrantyResponse>builder()
                .content(warrantyMapper.toResponseList(warranties.getContent()))
                .page(warranties.getNumber())
                .size(warranties.getSize())
                .totalElements(warranties.getTotalElements())
                .totalPages(warranties.getTotalPages())
                .first(warranties.isFirst())
                .last(warranties.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<WarrantyResponse> getAllWarranties(Pageable pageable) {
        Page<Warranty> warranties = warrantyRepository.findAll(pageable);
        return PageResponse.<WarrantyResponse>builder()
                .content(warrantyMapper.toResponseList(warranties.getContent()))
                .page(warranties.getNumber())
                .size(warranties.getSize())
                .totalElements(warranties.getTotalElements())
                .totalPages(warranties.getTotalPages())
                .first(warranties.isFirst())
                .last(warranties.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WarrantyResponse> getWarrantiesExpiringBetween(LocalDateTime startDate, LocalDateTime endDate) {
        List<Warranty> warranties = warrantyRepository.findWarrantiesExpiringBetween(startDate, endDate);
        return warranties.stream()
                .map(warrantyMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WarrantyResponse> getExpiredWarranties() {
        List<Warranty> warranties = warrantyRepository.findExpiredWarranties(LocalDateTime.now());
        return warranties.stream()
                .map(warrantyMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public void deleteWarranty(UUID id) {
        Warranty warranty = warrantyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bảo hành", "id", id));
        warrantyRepository.delete(warranty);
    }
    
    private String generateWarrantyCode() {
        String code;
        do {
            code = "BH" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (warrantyRepository.findByWarrantyCode(code).isPresent());
        return code;
    }
}

