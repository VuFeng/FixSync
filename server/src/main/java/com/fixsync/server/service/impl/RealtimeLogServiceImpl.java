package com.fixsync.server.service.impl;

import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RealtimeLogResponse;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.RealtimeLog;
import com.fixsync.server.entity.User;
import com.fixsync.server.entity.enums.ActionType;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.RealtimeLogMapper;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.RealtimeLogRepository;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.RealtimeLogService;
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
public class RealtimeLogServiceImpl implements RealtimeLogService {
    
    private final RealtimeLogRepository realtimeLogRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final RealtimeLogMapper realtimeLogMapper;
    
    @Override
    @Transactional
    public RealtimeLogResponse createLog(UUID deviceId, ActionType action, String detail, UUID createdById) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", createdById));
        
        RealtimeLog log = new RealtimeLog();
        log.setDevice(device);
        log.setAction(action);
        log.setDetail(detail);
        log.setCreatedBy(createdBy);
        
        log = realtimeLogRepository.save(log);
        
        return realtimeLogMapper.toResponse(log);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RealtimeLogResponse> getLogsByDeviceId(UUID deviceId) {
        List<RealtimeLog> logs = realtimeLogRepository.findByDeviceIdOrderByCreatedAtDesc(deviceId);
        return logs.stream()
                .map(realtimeLogMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<RealtimeLogResponse> getLogsByDeviceId(UUID deviceId, Pageable pageable) {
        Page<RealtimeLog> logs = realtimeLogRepository.findByDeviceId(deviceId, pageable);
        
        return PageResponse.<RealtimeLogResponse>builder()
                .content(realtimeLogMapper.toResponseList(logs.getContent()))
                .page(logs.getNumber())
                .size(logs.getSize())
                .totalElements(logs.getTotalElements())
                .totalPages(logs.getTotalPages())
                .first(logs.isFirst())
                .last(logs.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<RealtimeLogResponse> getLogsByDeviceIdAndAction(UUID deviceId, ActionType action, Pageable pageable) {
        Page<RealtimeLog> logs = realtimeLogRepository.findByDeviceIdAndAction(deviceId, action, pageable);
        
        return PageResponse.<RealtimeLogResponse>builder()
                .content(realtimeLogMapper.toResponseList(logs.getContent()))
                .page(logs.getNumber())
                .size(logs.getSize())
                .totalElements(logs.getTotalElements())
                .totalPages(logs.getTotalPages())
                .first(logs.isFirst())
                .last(logs.isLast())
                .build();
    }
}




