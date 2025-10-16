package com.kpi.hospital.service.impl;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kpi.hospital.dto.LoginRequest;
import com.kpi.hospital.dto.LoginResponse;
import com.kpi.hospital.dto.RegisterUserRequest;
import com.kpi.hospital.dto.UserDto;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.model.Role;
import com.kpi.hospital.model.RoleType;
import com.kpi.hospital.model.User;
import com.kpi.hospital.repository.HospitalRepository;
import com.kpi.hospital.repository.RoleRepository;
import com.kpi.hospital.repository.UserRepository;
import com.kpi.hospital.security.JwtTokenService;
import com.kpi.hospital.service.AuthService;
import com.kpi.hospital.util.DtoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HospitalRepository hospitalRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String token = jwtTokenService.generateToken(authentication);
        Instant expiresAt = jwtTokenService.getExpiryFromToken(token);
        Set<String> roles = authentication.getAuthorities().stream()
                .map(granted -> granted.getAuthority())
                .collect(java.util.stream.Collectors.toSet());
        return LoginResponse.builder()
                .token(token)
                .expiresAt(expiresAt)
                .roles(roles)
                .build();
    }

    @Override
    @Transactional
    public UserDto register(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        Hospital hospital = null;
        if (request.getHospitalId() != null) {
            hospital = hospitalRepository.findById(request.getHospitalId())
                    .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        }
        Set<Role> roles = new HashSet<>();
        for (RoleType roleType : request.getRoles()) {
            Role role = roleRepository.findByName(roleType)
                    .orElseGet(() -> roleRepository.save(Role.builder()
                            .name(roleType)
                            .description("Auto-provisioned role " + roleType.name())
                            .permissions(Set.of())
                            .build()));
            roles.add(role);
        }
        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .title(request.getTitle())
                .hospital(hospital)
                .roles(roles)
                .active(true)
                .build();
        return DtoMapper.toUserDto(userRepository.save(user));
    }
}
