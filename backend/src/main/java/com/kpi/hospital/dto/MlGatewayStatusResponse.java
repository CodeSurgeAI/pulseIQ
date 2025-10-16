package com.kpi.hospital.dto;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MlGatewayStatusResponse {

    boolean reachable;
    Instant lastHeartbeat;
    String message;
}
