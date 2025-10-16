package com.kpi.hospital.model;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KpiPoint {

    private Instant timestamp;

    private BigDecimal value;

    private String note;

    private String submittedBy;
}
