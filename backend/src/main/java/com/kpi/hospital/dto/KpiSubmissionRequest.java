package com.kpi.hospital.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Data
public class KpiSubmissionRequest {

    @NotBlank
    private String hospitalId;

    @NotBlank
    private String department;

    @NotBlank
    private String metric;

    @NotBlank
    private String unit;

    @NotNull
    private BigDecimal value;

    private BigDecimal target;

    private String note;
}
