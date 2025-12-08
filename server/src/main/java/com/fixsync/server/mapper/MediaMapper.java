package com.fixsync.server.mapper;

import com.fixsync.server.dto.response.MediaResponse;
import com.fixsync.server.entity.Media;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class}, 
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MediaMapper {
    
    @Mapping(target = "url", ignore = true) // Will be set manually in service
    MediaResponse toResponse(Media media);
    
    List<MediaResponse> toResponseList(List<Media> media);
}


