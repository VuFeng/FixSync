package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.CustomerRequest;
import com.fixsync.server.dto.response.CustomerResponse;
import com.fixsync.server.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", 
        unmappedTargetPolicy = ReportingPolicy.IGNORE, 
        nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
public interface CustomerMapper {
    
    CustomerResponse toResponse(Customer customer);
    
    List<CustomerResponse> toResponseList(List<Customer> customers);
    
    @org.mapstruct.Mapping(target = "id", ignore = true)
    @org.mapstruct.Mapping(target = "createdAt", ignore = true)
    @org.mapstruct.Mapping(target = "updatedAt", ignore = true)
    @org.mapstruct.Mapping(target = "version", ignore = true)
    @org.mapstruct.Mapping(target = "devices", ignore = true)
    Customer toEntity(CustomerRequest request);
    
    @org.mapstruct.Mapping(target = "id", ignore = true)
    @org.mapstruct.Mapping(target = "createdAt", ignore = true)
    @org.mapstruct.Mapping(target = "updatedAt", ignore = true)
    @org.mapstruct.Mapping(target = "version", ignore = true)
    @org.mapstruct.Mapping(target = "devices", ignore = true)
    void updateEntity(@MappingTarget Customer customer, CustomerRequest request);
}







