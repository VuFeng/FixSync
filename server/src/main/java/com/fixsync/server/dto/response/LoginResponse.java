package com.fixsync.server.dto.response;

import com.fixsync.server.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private UUID userId;
    private String email;
    private String fullName;
    private Role role;
    private String avatarUrl;
}


