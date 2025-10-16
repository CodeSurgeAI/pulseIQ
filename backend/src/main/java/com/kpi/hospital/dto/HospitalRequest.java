package com.kpi.hospital.dto;

import java.util.Map;
import java.util.Set;

import com.kpi.hospital.model.FederatedLearningState;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import lombok.Data;

@Data
public class HospitalRequest {

    private String id;

    @NotBlank
    private String name;

    @NotBlank
    private String code;

    @NotBlank
    private String address;

    private String city;

    private String country;

    @NotEmpty
    private Set<String> departments;

    private String directorEmail;

    private FederatedLearningState federatedState;

    private Map<String, Object> metadata;
}
