package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.RepairSessionRequest;
import com.fixsync.server.dto.response.RepairSessionResponse;
import com.fixsync.server.entity.RepairSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface RepairSessionMapper {

    @Mapping(target = "deviceId", source = "device.id")
    @Mapping(target = "device", ignore = true) // Will be mapped manually in service
    RepairSessionResponse toResponse(RepairSession session);

    List<RepairSessionResponse> toResponseList(List<RepairSession> sessions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "device", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "repairItems", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    RepairSession toEntity(RepairSessionRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "device", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "assignedTo", ignore = true)
    @Mapping(target = "repairItems", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    @Mapping(target = "warranties", ignore = true)
    void updateEntity(@MappingTarget RepairSession session, RepairSessionRequest request);
}







