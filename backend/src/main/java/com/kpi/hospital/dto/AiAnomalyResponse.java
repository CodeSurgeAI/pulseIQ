package com.kpi.hospital.dto;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AiAnomalyResponse {

    String hospitalId;
    String metric;
    String department;
    BigDecimal deviation;
    String severity;
    Instant detectedAt;
    String summary;
}
