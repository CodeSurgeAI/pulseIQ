package com.kpi.hospital.mock.ai;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.kpi.hospital.dto.AiAnomalyResponse;
import com.kpi.hospital.model.KpiPoint;
import com.kpi.hospital.model.KpiSeries;
import com.kpi.hospital.repository.KpiSeriesRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiAnomalyDetector {

    private final KpiSeriesRepository kpiSeriesRepository;

    public List<AiAnomalyResponse> detectAnomalies(String hospitalId) {
        List<KpiSeries> series = hospitalId != null
                ? kpiSeriesRepository.findByHospitalId(hospitalId)
                : kpiSeriesRepository.findAll();
        return series.stream()
                .map(this::scoreAnomaly)
                .filter(anomaly -> anomaly != null)
                .sorted(Comparator.comparing(AiAnomalyResponse::getDeviation).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    private AiAnomalyResponse scoreAnomaly(KpiSeries series) {
        if (series.getHistory().size() < 2) {
            return null;
        }
        KpiPoint latest = series.getHistory().get(series.getHistory().size() - 1);
        double avg = series.getHistory().stream()
                .map(KpiPoint::getValue)
                .mapToDouble(BigDecimal::doubleValue)
                .average()
                .orElse(0);
        double deviation = Math.abs(latest.getValue().doubleValue() - avg);
        double ratio = avg == 0 ? 0 : deviation / avg;
        if (ratio < 0.15) {
            return null;
        }
        String severity = ratio > 0.35 ? "HIGH" : ratio > 0.2 ? "MEDIUM" : "LOW";
        double noise = ThreadLocalRandom.current().nextDouble(0.8, 1.2);
        BigDecimal deviationValue = BigDecimal.valueOf(deviation * noise).setScale(2, RoundingMode.HALF_UP);
        return AiAnomalyResponse.builder()
                .hospitalId(series.getHospitalId())
                .metric(series.getMetric())
                .department(series.getDepartment())
                .deviation(deviationValue)
                .severity(severity)
                .detectedAt(Instant.now())
                .summary(String.format("%s deviated %.0f%% from rolling mean", series.getMetric(), ratio * 100))
                .build();
    }
}
