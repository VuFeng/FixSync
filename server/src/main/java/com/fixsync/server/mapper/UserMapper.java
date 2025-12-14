package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.UserRequest;
import com.fixsync.server.dto.response.UserResponse;
import com.fixsync.server.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    
    UserResponse toResponse(User user);
    
    List<UserResponse> toResponseList(List<User> users);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdDevices", ignore = true)
    @Mapping(target = "logs", ignore = true)
    User toEntity(UserRequest request);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "createdDevices", ignore = true)
    @Mapping(target = "logs", ignore = true)
    void updateEntity(@MappingTarget User user, UserRequest request);
}




