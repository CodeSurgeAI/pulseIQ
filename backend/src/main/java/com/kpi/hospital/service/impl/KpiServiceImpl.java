package com.kpi.hospital.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kpi.hospital.dto.KpiResponse;
import com.kpi.hospital.dto.KpiSubmissionRequest;
import com.kpi.hospital.model.KpiPoint;
import com.kpi.hospital.model.KpiSeries;
import com.kpi.hospital.repository.KpiSeriesRepository;
import com.kpi.hospital.service.KpiService;
import com.kpi.hospital.util.DtoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KpiServiceImpl implements KpiService {

    private final KpiSeriesRepository kpiSeriesRepository;

    @Override
    @Transactional
    public KpiResponse submitKpi(KpiSubmissionRequest request, String submittedBy) {
        KpiSeries series = kpiSeriesRepository
                .findByHospitalIdAndDepartmentAndMetric(request.getHospitalId(), request.getDepartment(),
                        request.getMetric())
                .orElseGet(KpiSeries::new);

        if (series.getId() == null) {
            series.setHospitalId(request.getHospitalId());
            series.setDepartment(request.getDepartment());
            series.setMetric(request.getMetric());
        }
        if (series.getHistory() == null) {
            series.setHistory(new ArrayList<>());
        }
        series.setUnit(request.getUnit());
        series.setTarget(request.getTarget());

        KpiPoint point = KpiPoint.builder()
                .timestamp(Instant.now())
                .value(request.getValue())
                .note(request.getNote())
                .submittedBy(submittedBy)
                .build();
        series.getHistory().add(point);
        KpiSeries saved = kpiSeriesRepository.save(series);
        return DtoMapper.toKpiResponse(saved);
    }

    @Override
    public List<KpiResponse> getKpiHistoryByHospital(String hospitalId) {
        return kpiSeriesRepository.findByHospitalId(hospitalId).stream()
                .map(DtoMapper::toKpiResponse)
                .collect(Collectors.toList());
    }
}
