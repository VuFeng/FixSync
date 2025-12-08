package com.fixsync.server.mapper;

import com.fixsync.server.dto.request.TransactionRequest;
import com.fixsync.server.dto.response.TransactionResponse;
import com.fixsync.server.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {
    
    @Mapping(source = "device.id", target = "deviceId")
    TransactionResponse toResponse(Transaction transaction);
    
    List<TransactionResponse> toResponseList(List<Transaction> transactions);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "device", ignore = true)
    Transaction toEntity(TransactionRequest request);
}




