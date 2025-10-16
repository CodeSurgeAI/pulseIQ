package com.kpi.hospital.service;

import java.util.List;

import com.kpi.hospital.dto.UpdateUserRequest;
import com.kpi.hospital.dto.UserDto;

public interface UserService {

    List<UserDto> getAllUsers();

    UserDto getUser(String userId);

    UserDto updateUser(String userId, UpdateUserRequest request);

    void deleteUser(String userId);
}
