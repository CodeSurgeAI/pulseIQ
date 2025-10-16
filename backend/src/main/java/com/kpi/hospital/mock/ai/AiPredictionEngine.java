package com.kpi.hospital.mock.ai;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.kpi.hospital.dto.AiPredictionResponse;
import com.kpi.hospital.model.KpiPoint;
import com.kpi.hospital.model.KpiSeries;
import com.kpi.hospital.repository.KpiSeriesRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiPredictionEngine {

    private final KpiSeriesRepository kpiSeriesRepository;

    public List<AiPredictionResponse> generatePredictions(String hospitalId) {
        List<KpiSeries> series = hospitalId != null
                ? kpiSeriesRepository.findByHospitalId(hospitalId)
                : kpiSeriesRepository.findAll();
        return series.stream()
                .map(this::toPrediction)
                .collect(Collectors.toList());
    }

    private AiPredictionResponse toPrediction(KpiSeries series) {
        List<KpiPoint> history = series.getHistory();
        KpiPoint latest = (history == null || history.isEmpty()) ? null : history.get(history.size() - 1);
        BigDecimal baseValue = latest != null ? latest.getValue()
                : series.getTarget() != null ? series.getTarget() : BigDecimal.valueOf(50);
        double delta = ThreadLocalRandom.current().nextDouble(-0.05, 0.12);
        BigDecimal predicted = baseValue.multiply(BigDecimal.valueOf(1 + delta)).setScale(2, RoundingMode.HALF_UP);
        return AiPredictionResponse.builder()
                .hospitalId(series.getHospitalId())
                .department(series.getDepartment())
                .metric(series.getMetric())
                .predictedValue(predicted)
                .predictedFor(Instant.now().plus(7, ChronoUnit.DAYS))
                .explanation(String.format("Trend-based projection using %.0f%% delta", delta * 100))
                .build();
    }
}
