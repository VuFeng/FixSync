package com.fixsync.server.service;

import com.fixsync.server.dto.request.UserRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse updateUser(UUID id, UserRequest request);
    UserResponse getUserById(UUID id);
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
    void deleteUser(UUID id);
    UserResponse activateUser(UUID id);
    UserResponse deactivateUser(UUID id);
}



