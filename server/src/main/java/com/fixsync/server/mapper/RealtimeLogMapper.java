package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.RealtimeLogResponse;
import com.fixsync.server.entity.RealtimeLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RealtimeLogMapper {
    
    @Mapping(source = "device.id", target = "deviceId")
    RealtimeLogResponse toResponse(RealtimeLog log);
    
    List<RealtimeLogResponse> toResponseList(List<RealtimeLog> logs);
}




