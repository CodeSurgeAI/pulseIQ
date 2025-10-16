package com.kpi.hospital.dto;

import java.util.Set;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserDto {

    String id;

    String email;

    String fullName;

    String title;

    String hospitalId;

    Set<String> roles;

    boolean active;
}
