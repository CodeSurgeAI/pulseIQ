package com.kpi.hospital.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class LeaderboardEntry {

    String hospitalId;
    String hospitalName;
    double efficiencyScore;
    int rank;
}
