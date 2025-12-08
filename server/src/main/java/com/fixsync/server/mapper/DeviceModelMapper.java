package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.DeviceModelResponse;
import com.fixsync.server.entity.DeviceModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface DeviceModelMapper {
    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    DeviceModelResponse toResponse(DeviceModel deviceModel);
    
    List<DeviceModelResponse> toResponseList(List<DeviceModel> deviceModels);
}


