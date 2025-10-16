package com.kpi.hospital.dto;

import java.util.Set;

import com.kpi.hospital.model.RoleType;

import lombok.Data;

@Data
public class UpdateUserRequest {

    private Set<RoleType> roles;

    private Boolean active;

    private String hospitalId;

    private String title;
}
