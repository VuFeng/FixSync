package com.fixsync.server.service;

import com.fixsync.server.dto.request.LoginRequest;
import com.fixsync.server.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}




