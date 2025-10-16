package com.kpi.hospital.dto;

import java.util.List;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class DashboardSummaryResponse {

    long totalHospitals;
    long activeHospitals;
    long monitoredKpis;
    List<String> alerts;
    List<String> recommendations;
}
