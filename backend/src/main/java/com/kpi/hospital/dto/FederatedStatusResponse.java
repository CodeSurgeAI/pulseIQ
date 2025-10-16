package com.kpi.hospital.dto;

import java.time.Instant;

import com.kpi.hospital.model.FederatedLearningState;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class FederatedStatusResponse {

    String hospitalId;
    FederatedLearningState state;
    Instant lastSync;
    double progress;
    String message;
}
