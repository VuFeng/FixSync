package com.fixsync.server.service;

import com.fixsync.server.dto.request.RepairItemRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.RepairItemResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface RepairItemService {
    RepairItemResponse createRepairItem(RepairItemRequest request);
    RepairItemResponse updateRepairItem(UUID id, RepairItemRequest request);
    RepairItemResponse getRepairItemById(UUID id);
    List<RepairItemResponse> getRepairItemsByDeviceId(UUID deviceId);
    PageResponse<RepairItemResponse> getRepairItemsByDeviceId(UUID deviceId, Pageable pageable);
    PageResponse<RepairItemResponse> getAllRepairItems(Pageable pageable);
    void deleteRepairItem(UUID id);
    Integer calculateTotalCostByDeviceId(UUID deviceId);
}




