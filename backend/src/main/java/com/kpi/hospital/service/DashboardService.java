package com.kpi.hospital.service;

import com.kpi.hospital.dto.DashboardSummaryResponse;

public interface DashboardService {

    DashboardSummaryResponse getSummaryForUser(String userEmail);
}
