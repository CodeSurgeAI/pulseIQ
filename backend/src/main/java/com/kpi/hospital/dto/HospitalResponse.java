package com.kpi.hospital.dto;

import java.util.Map;
import java.util.Set;

import com.kpi.hospital.model.FederatedLearningState;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class HospitalResponse {

    String id;
    String name;
    String code;
    String address;
    String city;
    String country;
    Set<String> departments;
    String directorEmail;
    FederatedLearningState federatedState;
    Map<String, Object> metadata;
}
