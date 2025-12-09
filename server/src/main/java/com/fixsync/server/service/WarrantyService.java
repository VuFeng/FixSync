package com.fixsync.server.service;

import com.fixsync.server.dto.request.WarrantyRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.WarrantyResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface WarrantyService {
    WarrantyResponse createWarranty(WarrantyRequest request);
    WarrantyResponse updateWarranty(UUID id, WarrantyRequest request);
    WarrantyResponse getWarrantyById(UUID id);
    WarrantyResponse getWarrantyByCode(String warrantyCode);
    List<WarrantyResponse> getWarrantiesByDeviceId(UUID deviceId);
    PageResponse<WarrantyResponse> getWarrantiesByDeviceId(UUID deviceId, Pageable pageable);
    PageResponse<WarrantyResponse> getAllWarranties(Pageable pageable);
    List<WarrantyResponse> getWarrantiesExpiringBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<WarrantyResponse> getExpiredWarranties();
    void deleteWarranty(UUID id);
}



