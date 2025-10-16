package com.kpi.hospital.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AiRecommendationResponse {

    String hospitalId;
    String department;
    String metric;
    String recommendation;
    String impact;
}
