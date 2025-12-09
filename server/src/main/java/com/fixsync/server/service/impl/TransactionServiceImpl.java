package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.TransactionRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.TransactionResponse;
import com.fixsync.server.entity.Device;
import com.fixsync.server.entity.Transaction;
import com.fixsync.server.exception.BadRequestException;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.TransactionMapper;
import com.fixsync.server.repository.DeviceRepository;
import com.fixsync.server.repository.TransactionRepository;
import com.fixsync.server.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final DeviceRepository deviceRepository;
    private final TransactionMapper transactionMapper;
    
    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
        
        // Check if transaction already exists for this device
        if (transactionRepository.findByDeviceId(request.getDeviceId()).isPresent()) {
            throw new BadRequestException("Thiết bị này đã có giao dịch thanh toán");
        }
        
        Transaction transaction = transactionMapper.toEntity(request);
        transaction.setDevice(device);
        transaction.setFinalAmount(request.getTotal() - request.getDiscount());
        
        if (transaction.getFinalAmount() < 0) {
            throw new BadRequestException("Số tiền cuối cùng không được âm");
        }
        
        transaction = transactionRepository.save(transaction);
        
        return transactionMapper.toResponse(transaction);
    }
    
    @Override
    @Transactional
    public TransactionResponse updateTransaction(UUID id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch", "id", id));
        
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Thiết bị", "id", request.getDeviceId()));
        
        // Check if another transaction exists for this device (excluding current transaction)
        transactionRepository.findByDeviceId(request.getDeviceId())
                .ifPresent(existingTransaction -> {
                    if (!existingTransaction.getId().equals(id)) {
                        throw new BadRequestException("Thiết bị này đã có giao dịch thanh toán khác");
                    }
                });
        
        transaction.setDevice(device);
        transaction.setTotal(request.getTotal());
        transaction.setDiscount(request.getDiscount());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setFinalAmount(request.getTotal() - request.getDiscount());
        
        if (transaction.getFinalAmount() < 0) {
            throw new BadRequestException("Số tiền cuối cùng không được âm");
        }
        
        transaction = transactionRepository.save(transaction);
        
        return transactionMapper.toResponse(transaction);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(UUID id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch", "id", id));
        return transactionMapper.toResponse(transaction);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TransactionResponse> getTransactionByDeviceId(UUID deviceId) {
        return transactionRepository.findByDeviceId(deviceId)
                .map(transactionMapper::toResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getTransactionsByDeviceId(UUID deviceId, Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findByDeviceId(deviceId, pageable);
        
        return PageResponse.<TransactionResponse>builder()
                .content(transactionMapper.toResponseList(transactions.getContent()))
                .page(transactions.getNumber())
                .size(transactions.getSize())
                .totalElements(transactions.getTotalElements())
                .totalPages(transactions.getTotalPages())
                .first(transactions.isFirst())
                .last(transactions.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getAllTransactions(Pageable pageable) {
        Page<Transaction> transactions = transactionRepository.findAll(pageable);
        return PageResponse.<TransactionResponse>builder()
                .content(transactionMapper.toResponseList(transactions.getContent()))
                .page(transactions.getNumber())
                .size(transactions.getSize())
                .totalElements(transactions.getTotalElements())
                .totalPages(transactions.getTotalPages())
                .first(transactions.isFirst())
                .last(transactions.isLast())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Long calculateRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        Long revenue = transactionRepository.sumFinalAmountByDateRange(startDate, endDate);
        return revenue != null ? revenue : 0L;
    }
    
    @Override
    @Transactional
    public void deleteTransaction(UUID id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dịch", "id", id));
        transactionRepository.delete(transaction);
    }
}



