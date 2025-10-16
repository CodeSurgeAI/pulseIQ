package com.kpi.hospital.service;

import com.kpi.hospital.dto.LoginRequest;
import com.kpi.hospital.dto.LoginResponse;
import com.kpi.hospital.dto.RegisterUserRequest;
import com.kpi.hospital.dto.UserDto;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserDto register(RegisterUserRequest request);
}
