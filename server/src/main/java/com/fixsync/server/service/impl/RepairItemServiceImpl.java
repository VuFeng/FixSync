package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.RepairItemRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairItemResponse;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.RepairItem;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.RepairItemMapper;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.RepairItemRepository;
import com.fixsync.server.service.RepairItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepairItemServiceImpl implements RepairItemService {
    
    private final RepairItemRepository repairItemRepository;
    private final DeviceRepository deviceRepository;
    private final RepairItemMapper repairItemMapper;
    
    @Override
    @Transactional
    public RepairItemResponse createRepairItem(RepairItemRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
        
        RepairItem repairItem = repairItemMapper.toEntity(request);
        repairItem.setDevice(device);
        repairItem = repairItemRepository.save(repairItem);
        
        return repairItemMapper.toResponse(repairItem);
    }
    
    @Override
    @Transactional
    public RepairItemResponse updateRepairItem(UUID id, RepairItemRequest request) {
        RepairItem repairItem = repairItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ sửa chữa", "id", id));
        
        if (!repairItem.getDevice().getId().equals(request.getDeviceId())) {
            Device device = deviceRepository.findById(request.getDeviceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
            repairItem.setDevice(device);
        }
        
        repairItemMapper.updateEntity(repairItem, request);
        repairItem = repairItemRepository.save(repairItem);
        
        return repairItemMapper.toResponse(repairItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public RepairItemResponse getRepairItemById(UUID id) {
        RepairItem repairItem = repairItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ sửa chữa", "id", id));
        return repairItemMapper.toResponse(repairItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RepairItemResponse> getRepairItemsByDeviceId(UUID deviceId) {
        List<RepairItem> repairItems = repairItemRepository.findByDeviceId(deviceId);
        return repairItems.stream()
                .map(repairItemMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<RepairItemResponse> getRepairItemsByDeviceId(UUID deviceId, Pageable pageable) {
        Page<RepairItem> repairItems = repairItemRepository.findByDeviceId(deviceId, pageable);
        
        return PageResponse.<RepairItemResponse>builder()
                .content(repairItemMapper.toResponseList(repairItems.getContent()))
                .page(repairItems.getNumber())
                .size(repairItems.getSize())
                .totalElements(repairItems.getTotalElements())
                .totalPages(repairItems.getTotalPages())
                .first(repairItems.isFirst())
                .last(repairItems.isLast())
                .build();
    }
    
    @Override
    @Transactional
    public void deleteRepairItem(UUID id) {
        RepairItem repairItem = repairItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dịch vụ sửa chữa", "id", id));
        repairItemRepository.delete(repairItem);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Integer calculateTotalCostByDeviceId(UUID deviceId) {
        Integer total = repairItemRepository.sumCostByDeviceId(deviceId);
        return total != null ? total : 0;
    }
}




