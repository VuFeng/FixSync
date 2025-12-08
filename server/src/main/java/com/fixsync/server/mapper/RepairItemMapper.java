package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.RepairItemRequest;
import com.fixsync.server.dto.response.RepairItemResponse;
import com.fixsync.server.entity.RepairItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RepairItemMapper {
    
    @Mapping(source = "device.id", target = "deviceId")
    RepairItemResponse toResponse(RepairItem repairItem);
    
    List<RepairItemResponse> toResponseList(List<RepairItem> repairItems);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "device", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    RepairItem toEntity(RepairItemRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "device", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    void updateEntity(@MappingTarget RepairItem repairItem, RepairItemRequest request);
}




