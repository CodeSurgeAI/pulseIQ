package com.kpi.hospital.dto;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AiPredictionResponse {

    String hospitalId;
    String department;
    String metric;
    BigDecimal predictedValue;
    Instant predictedFor;
    String explanation;
}
