package com.kpi.hospital.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kpi.hospital.dto.UpdateUserRequest;
import com.kpi.hospital.dto.UserDto;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.model.Role;
import com.kpi.hospital.model.RoleType;
import com.kpi.hospital.model.User;
import com.kpi.hospital.repository.HospitalRepository;
import com.kpi.hospital.repository.RoleRepository;
import com.kpi.hospital.repository.UserRepository;
import com.kpi.hospital.service.UserService;
import com.kpi.hospital.util.DtoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HospitalRepository hospitalRepository;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(DtoMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto getUser(String userId) {
        return userRepository.findById(userId)
                .map(DtoMapper::toUserDto)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Override
    @Transactional
    public UserDto updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.getRoles() != null) {
            Set<Role> roles = new HashSet<>();
            for (RoleType roleType : request.getRoles()) {
                Role role = roleRepository.findByName(roleType)
                        .orElseThrow(() -> new IllegalArgumentException("Role not found: " + roleType));
                roles.add(role);
            }
            user.setRoles(roles);
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        if (request.getHospitalId() != null) {
            Hospital hospital = hospitalRepository.findById(request.getHospitalId())
                    .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
            user.setHospital(hospital);
        }
        if (request.getTitle() != null) {
            user.setTitle(request.getTitle());
        }
        return DtoMapper.toUserDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
}
