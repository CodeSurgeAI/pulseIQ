package com.kpi.hospital.service;

import java.util.List;

import com.kpi.hospital.dto.KpiResponse;
import com.kpi.hospital.dto.KpiSubmissionRequest;

public interface KpiService {

    KpiResponse submitKpi(KpiSubmissionRequest request, String submittedBy);

    List<KpiResponse> getKpiHistoryByHospital(String hospitalId);
}
