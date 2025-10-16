package com.kpi.hospital.dto;

import java.util.Set;

import com.kpi.hospital.model.RoleType;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import lombok.Data;

@Data
public class RegisterUserRequest {

    @NotBlank
    private String fullName;

    private String title;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String hospitalId;

    @NotEmpty
    private Set<RoleType> roles;
}
