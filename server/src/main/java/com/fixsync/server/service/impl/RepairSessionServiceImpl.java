package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.RepairSessionRequest;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairSessionResponse;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.RepairSession;
import com.fixsync.server.entity.User;
import com.fixsync.server.entity.enums.DeviceStatus;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.BrandMapper;
import com.fixsync.server.mapper.CustomerMapper;
import com.fixsync.server.mapper.DeviceMapper;
import com.fixsync.server.mapper.DeviceModelMapper;
import com.fixsync.server.mapper.RepairSessionMapper;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.RepairSessionRepository;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.RepairSessionService;
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
public class RepairSessionServiceImpl implements RepairSessionService {

    private final RepairSessionRepository repairSessionRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final RepairSessionMapper repairSessionMapper;
    private final DeviceMapper deviceMapper;
    private final BrandMapper brandMapper;
    private final DeviceModelMapper deviceModelMapper;
    private final CustomerMapper customerMapper;

    @Override
    @Transactional
    public RepairSessionResponse createSession(RepairSessionRequest request, UUID createdById) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));

        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", createdById));

        RepairSession session = repairSessionMapper.toEntity(request);
        session.setDevice(device);
        session.setCreatedBy(createdBy);
        session.setStatus(request.getStatus() != null ? request.getStatus() : DeviceStatus.RECEIVED);
        session.setReceivedDate(request.getReceivedDate() != null ? request.getReceivedDate() : LocalDateTime.now());

        if (request.getAssignedTo() != null) {
            User assigned = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", request.getAssignedTo()));
            session.setAssignedTo(assigned);
        }

        session = repairSessionRepository.save(session);
        return mapToResponse(session);
    }

    @Override
    @Transactional
    public RepairSessionResponse updateSession(UUID id, RepairSessionRequest request) {
        RepairSession session = repairSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "id", id));

        if (request.getAssignedTo() != null) {
            User assigned = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", request.getAssignedTo()));
            session.setAssignedTo(assigned);
        }

        repairSessionMapper.updateEntity(session, request);

        if (request.getStatus() != null) {
            session.setStatus(request.getStatus());
        }
        if (request.getReceivedDate() != null) {
            session.setReceivedDate(request.getReceivedDate());
        }

        session = repairSessionRepository.save(session);
        return mapToResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public RepairSessionResponse getSessionById(UUID id) {
        RepairSession session = repairSessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phiên sửa chữa", "id", id));
        return mapToResponse(session);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<RepairSessionResponse> getAllSessions(Pageable pageable) {
        Page<RepairSession> page = repairSessionRepository.findAll(pageable);
        List<RepairSessionResponse> responses = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return PageResponse.<RepairSessionResponse>builder()
                .content(responses)
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
    public PageResponse<RepairSessionResponse> getSessionsByDevice(UUID deviceId, Pageable pageable) {
        Page<RepairSession> page = repairSessionRepository.findByDeviceId(deviceId, pageable);
        List<RepairSessionResponse> responses = page.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return PageResponse.<RepairSessionResponse>builder()
                .content(responses)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }

    /**
     * Map RepairSession to RepairSessionResponse with full device information
     */
    private RepairSessionResponse mapToResponse(RepairSession session) {
        RepairSessionResponse response = repairSessionMapper.toResponse(session);
        
        // Map device with full information
        if (session.getDevice() != null) {
            Device device = session.getDevice();
            DeviceResponse deviceResponse = deviceMapper.toResponse(device);
            
            // Map customer to CustomerResponse object
            if (device.getCustomer() != null) {
                deviceResponse.setCustomer(customerMapper.toResponse(device.getCustomer()));
                // Also set legacy fields from customer for backward compatibility
                if (deviceResponse.getCustomerName() == null) {
                    deviceResponse.setCustomerName(device.getCustomer().getName());
                }
                if (deviceResponse.getCustomerPhone() == null) {
                    deviceResponse.setCustomerPhone(device.getCustomer().getPhone());
                }
            }
            
            // Map brandEntity to BrandResponse object
            if (device.getBrandEntity() != null) {
                deviceResponse.setBrand(brandMapper.toResponse(device.getBrandEntity()));
            }
            
            // Map modelEntity to DeviceModelResponse object
            if (device.getModelEntity() != null) {
                deviceResponse.setModel(deviceModelMapper.toResponse(device.getModelEntity()));
            }
            
            response.setDevice(deviceResponse);
        }
        
        return response;
    }
}







