package com.kpi.hospital.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class KpiResponse {

    String id;
    String hospitalId;
    String department;
    String metric;
    String unit;
    BigDecimal target;
    BigDecimal latestValue;
    Instant latestTimestamp;
    List<KpiHistoryPoint> history;

    @Value
    @Builder
    public static class KpiHistoryPoint {
        Instant timestamp;
        BigDecimal value;
        String note;
        String submittedBy;
    }
}
