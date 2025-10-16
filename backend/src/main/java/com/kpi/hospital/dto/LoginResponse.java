package com.kpi.hospital.dto;

import java.time.Instant;
import java.util.Set;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class LoginResponse {

    String token;

    Instant expiresAt;

    Set<String> roles;
}
