package com.fixsync.server.service.impl;

import com.fixsync.server.dto.request.UserRequest;
import com.fixsync.server.dto.response.PageResponse;
import com.fixsync.server.dto.response.UserResponse;
import com.fixsync.server.entity.User;
import com.fixsync.server.exception.BadRequestException;
import com.fixsync.server.exception.ResourceNotFoundException;
import com.fixsync.server.mapper.UserMapper;
import com.fixsync.server.repository.UserRepository;
import com.fixsync.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }
        
        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }
        
        userMapper.updateEntity(user, request);
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        user = userRepository.save(user);
        
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        
        return PageResponse.<UserResponse>builder()
                .content(userMapper.toResponseList(users.getContent()))
                .page(users.getNumber())
                .size(users.getSize())
                .totalElements(users.getTotalElements())
                .totalPages(users.getTotalPages())
                .first(users.isFirst())
                .last(users.isLast())
                .build();
    }
    
    @Override
    @Transactional
    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        userRepository.delete(user);
    }
    
    @Override
    @Transactional
    public UserResponse activateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        user.setIsActive(true);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
    
    @Override
    @Transactional
    public UserResponse deactivateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        user.setIsActive(false);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}



