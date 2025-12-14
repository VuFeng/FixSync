package com.fixsync.server.service;

import com.fixsync.server.dto.request.CustomerRequest;
import com.fixsync.server.dto.response.CustomerResponse;
import com.fixsync.server.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest request);
    CustomerResponse updateCustomer(UUID id, CustomerRequest request);
    CustomerResponse getCustomerById(UUID id);
    PageResponse<CustomerResponse> getCustomers(String search, Pageable pageable);
    void deleteCustomer(UUID id);
}







