package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.DeviceModelResponse;
import com.fixsync.server.entity.DeviceModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeviceModelMapper {
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    DeviceModelResponse toResponse(DeviceModel deviceModel);
    
    List<DeviceModelResponse> toResponseList(List<DeviceModel> deviceModels);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "brand", ignore = true)
    DeviceModel toEntity(DeviceModelResponse response);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "brand", ignore = true)
    void updateEntity(@MappingTarget DeviceModel entity, DeviceModelResponse response);
}


