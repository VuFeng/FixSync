package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.WarrantyResponse;
import com.fixsync.server.entity.Warranty;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WarrantyMapper {
    
    @Mapping(source = "device.id", target = "deviceId")
    @Mapping(source = "repairItem.id", target = "repairItemId")
    WarrantyResponse toResponse(Warranty warranty);
    
    List<WarrantyResponse> toResponseList(List<Warranty> warranties);
}




