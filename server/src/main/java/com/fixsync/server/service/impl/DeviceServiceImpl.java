package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.DeviceRequest;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.entity.Brand;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.DeviceModel;
import com.fixsync.server.entity.User;
import com.fixsync.server.entity.enums.ActionType;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.BrandMapper;
import com.fixsync.server.mapper.CustomerMapper;
import com.fixsync.server.mapper.DeviceMapper;
import com.fixsync.server.mapper.DeviceModelMapper;
import com.fixsync.server.repository.BrandRepository;
import com.fixsync.server.repository.CustomerRepository;
import com.fixsync.server.repository.DeviceModelRepository;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.RepairItemRepository;
import com.fixsync.server.repository.RepairSessionRepository;
import com.fixsync.server.repository.TransactionRepository;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.DeviceService;
import com.fixsync.server.service.RealtimeLogService;
import com.fixsync.server.mapper.RepairItemMapper;
import com.fixsync.server.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {
    
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final BrandRepository brandRepository;
    private final DeviceModelRepository deviceModelRepository;
    private final CustomerRepository customerRepository;
    private final DeviceMapper deviceMapper;
    private final BrandMapper brandMapper;
    private final DeviceModelMapper deviceModelMapper;
    private final CustomerMapper customerMapper;
    private final RepairItemRepository repairItemRepository;
    private final TransactionRepository transactionRepository;
    private final RepairItemMapper repairItemMapper;
    private final TransactionMapper transactionMapper;
    private final RealtimeLogService realtimeLogService;
    private final RepairSessionRepository repairSessionRepository;
    
    @Override
    @Transactional
    public DeviceResponse createDevice(DeviceRequest request, UUID createdById) {
        User createdBy = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", createdById));
        
        // Load brand and model
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", request.getBrandId()));
        
        DeviceModel model = deviceModelRepository.findById(request.getModelId())
                .orElseThrow(() -> new ResourceNotFoundException("Model", "id", request.getModelId()));
        
        Device device = deviceMapper.toEntity(request);
        device.setCreatedBy(createdBy);
        device.setBrandEntity(brand);
        device.setModelEntity(model);
        
        // Set legacy fields for backward compatibility
        device.setBrand(brand.getName());
        device.setModel(model.getName());
        // deviceType must never be null (DB constraint) - prefer request value, fallback to model, then default
        String resolvedDeviceType = request.getDeviceType();
        if (resolvedDeviceType == null || resolvedDeviceType.isBlank()) {
            resolvedDeviceType = model.getDeviceType();
        }
        if (resolvedDeviceType == null || resolvedDeviceType.isBlank()) {
            resolvedDeviceType = "UNKNOWN";
        }
        device.setDeviceType(resolvedDeviceType);
        
        // Handle customer - priority: customerId > customerName/customerPhone
        if (request.getCustomerId() != null) {
            // Use existing customer
            com.fixsync.server.entity.Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", request.getCustomerId()));
            device.setCustomer(customer);
            device.setCustomerName(customer.getName());
            device.setCustomerPhone(customer.getPhone());
        } else if (request.getCustomerName() != null && request.getCustomerPhone() != null) {
            // Try to find existing customer by phone, or create new one
            com.fixsync.server.entity.Customer customer = customerRepository.findByPhone(request.getCustomerPhone())
                    .orElseGet(() -> {
                        // Create new customer
                        com.fixsync.server.entity.Customer newCustomer = new com.fixsync.server.entity.Customer();
                        newCustomer.setName(request.getCustomerName());
                        newCustomer.setPhone(request.getCustomerPhone());
                        return customerRepository.save(newCustomer);
                    });
            device.setCustomer(customer);
            device.setCustomerName(customer.getName());
            device.setCustomerPhone(customer.getPhone());
        }
        // If neither customerId nor customerName/customerPhone provided, device can exist without customer
        
        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();
        
        // Log action
        realtimeLogService.createLog(deviceId, ActionType.CREATED, 
                "Thiết bị được tạo mới", createdById);
        
        // Reload device with EntityGraph to ensure brandEntity and modelEntity are loaded
        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));
        
        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional
    public DeviceResponse updateDevice(UUID id, DeviceRequest request) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        
        // Update brand and model if provided
        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findById(request.getBrandId())
                    .orElseThrow(() -> new ResourceNotFoundException("Hãng", "id", request.getBrandId()));
            device.setBrandEntity(brand);
            device.setBrand(brand.getName());
        }
        
        if (request.getModelId() != null) {
            DeviceModel model = deviceModelRepository.findById(request.getModelId())
                    .orElseThrow(() -> new ResourceNotFoundException("Model", "id", request.getModelId()));
            device.setModelEntity(model);
            device.setModel(model.getName());
            // Re-resolve deviceType to avoid null constraint issues
            String resolvedDeviceType = request.getDeviceType();
            if (resolvedDeviceType == null || resolvedDeviceType.isBlank()) {
                resolvedDeviceType = model.getDeviceType();
            }
            if (resolvedDeviceType == null || resolvedDeviceType.isBlank()) {
                resolvedDeviceType = "UNKNOWN";
            }
            device.setDeviceType(resolvedDeviceType);
        }
        
        // Handle customer update - priority: customerId > customerName/customerPhone
        if (request.getCustomerId() != null) {
            // Use existing customer
            com.fixsync.server.entity.Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", request.getCustomerId()));
            device.setCustomer(customer);
            device.setCustomerName(customer.getName());
            device.setCustomerPhone(customer.getPhone());
        } else if (request.getCustomerName() != null && request.getCustomerPhone() != null) {
            // Try to find existing customer by phone, or create new one
            com.fixsync.server.entity.Customer customer = customerRepository.findByPhone(request.getCustomerPhone())
                    .orElseGet(() -> {
                        // Create new customer
                        com.fixsync.server.entity.Customer newCustomer = new com.fixsync.server.entity.Customer();
                        newCustomer.setName(request.getCustomerName());
                        newCustomer.setPhone(request.getCustomerPhone());
                        return customerRepository.save(newCustomer);
                    });
            device.setCustomer(customer);
            device.setCustomerName(customer.getName());
            device.setCustomerPhone(customer.getPhone());
        } else if (request.getCustomerId() == null && request.getCustomerName() == null && request.getCustomerPhone() == null) {
            // Clear customer if all fields are null
            device.setCustomer(null);
            device.setCustomerName(null);
            device.setCustomerPhone(null);
        }
        
        deviceMapper.updateEntity(device, request);

        Device savedDevice = deviceRepository.save(device);
        UUID deviceId = savedDevice.getId();

        // Log action
        realtimeLogService.createLog(deviceId, ActionType.UPDATED,
                "Thiết bị được cập nhật", savedDevice.getCreatedBy().getId());

        Device reloadedDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", deviceId));

        return mapToResponse(reloadedDevice);
    }
    
    @Override
    @Transactional(readOnly = true)
    public DeviceResponse getDeviceById(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        return mapToResponse(device);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<DeviceResponse> getAllDevices(Pageable pageable) {
        Page<Device> devices = deviceRepository.findAll(pageable);
        
        // Map each device with brand and model objects
        java.util.List<DeviceResponse> deviceResponses = devices.getContent().stream()
                .map(this::mapToResponse)
                .toList();
        
        return PageResponse.<DeviceResponse>builder()
                .content(deviceResponses)
                .page(devices.getNumber())
                .size(devices.getSize())
                .totalElements(devices.getTotalElements())
                .totalPages(devices.getTotalPages())
                .first(devices.isFirst())
                .last(devices.isLast())
                .build();
    }
    
    @Override
    @Transactional
    public void deleteDevice(UUID id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", id));
        deviceRepository.delete(device);
    }
    
    /**
     * Helper method to map Device to DeviceResponse with brand and model objects
     */
    private DeviceResponse mapToResponse(Device device) {
        DeviceResponse response = deviceMapper.toResponse(device);
        
        // Map customer to CustomerResponse object
        if (device.getCustomer() != null) {
            response.setCustomer(customerMapper.toResponse(device.getCustomer()));
            // Also set legacy fields from customer for backward compatibility
            if (response.getCustomerName() == null) {
                response.setCustomerName(device.getCustomer().getName());
            }
            if (response.getCustomerPhone() == null) {
                response.setCustomerPhone(device.getCustomer().getPhone());
            }
        }
        
        // Map brandEntity to BrandResponse object
        if (device.getBrandEntity() != null) {
            response.setBrand(brandMapper.toResponse(device.getBrandEntity()));
        }
        
        // Map modelEntity to DeviceModelResponse object
        if (device.getModelEntity() != null) {
            response.setModel(deviceModelMapper.toResponse(device.getModelEntity()));
        }

        // Map repair items
        var repairItems = repairItemRepository.findByDeviceId(device.getId());
        var repairItemResponses = repairItemMapper.toResponseList(repairItems);
        response.setRepairItems(repairItemResponses);

        // Compute subtotal from repair items (ignore null costs)
        int subtotal = repairItems.stream()
                .map(ri -> ri.getCost() == null ? 0 : ri.getCost())
                .reduce(0, Integer::sum);
        response.setRepairSubtotal(subtotal);

        // Map latest transaction (if any) by device (latest created)
        transactionRepository.findTopByDeviceIdOrderByCreatedAtDesc(device.getId())
                .ifPresent(tx -> response.setTransaction(transactionMapper.toResponse(tx)));

        // Compute outstanding = subtotal - finalAmount (never negative)
        int finalAmount = response.getTransaction() != null && response.getTransaction().getFinalAmount() != null
                ? response.getTransaction().getFinalAmount()
                : 0;
        int outstanding = Math.max(0, subtotal - finalAmount);
        response.setOutstandingAmount(outstanding);
        
        return response;
    }
}



