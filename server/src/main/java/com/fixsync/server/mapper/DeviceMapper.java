package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.DeviceRequest;
import com.fixsync.server.dto.response.DeviceResponse;
import com.fixsync.server.entity.Device;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class, RepairItemMapper.class, TransactionMapper.class, CustomerMapper.class}, 
        unmappedTargetPolicy = ReportingPolicy.IGNORE, nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface DeviceMapper {
    
    @Mapping(target = "repairItems", ignore = true)
    @Mapping(target = "transaction", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "model", ignore = true)
    DeviceResponse toResponse(Device device);
    
    List<DeviceResponse> toResponseList(List<Device> devices);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "repairItems", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    @Mapping(target = "logs", ignore = true)
    @Mapping(target = "brandEntity", ignore = true)
    @Mapping(target = "modelEntity", ignore = true)
    Device toEntity(DeviceRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "repairItems", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    @Mapping(target = "logs", ignore = true)
    @Mapping(target = "brandEntity", ignore = true)
    @Mapping(target = "modelEntity", ignore = true)
    void updateEntity(@MappingTarget Device device, DeviceRequest request);
}


