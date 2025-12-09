package com.fixsync.server.service;

import com.fixsync.server.dto.request.TransactionRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.TransactionResponse;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    TransactionResponse updateTransaction(UUID id, TransactionRequest request);
    TransactionResponse getTransactionById(UUID id);
    Optional<TransactionResponse> getTransactionByDeviceId(UUID deviceId);
    PageResponse<TransactionResponse> getTransactionsByDeviceId(UUID deviceId, Pageable pageable);
    PageResponse<TransactionResponse> getAllTransactions(Pageable pageable);
    Long calculateRevenue(LocalDateTime startDate, LocalDateTime endDate);
    void deleteTransaction(UUID id);
}



