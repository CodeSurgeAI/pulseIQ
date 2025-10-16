package com.kpi.hospital.mock.ai;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.kpi.hospital.dto.AiRecommendationResponse;
import com.kpi.hospital.model.KpiSeries;
import com.kpi.hospital.repository.KpiSeriesRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AiRecommendationEngine {

    private static final List<String> PLAYBOOK = List.of(
            "Optimize discharge planning workflows",
            "Introduce targeted staff coaching",
            "Review supply chain reorder points",
            "Increase bedside rounding frequency",
            "Launch patient education refresh");

    private final KpiSeriesRepository kpiSeriesRepository;

    public List<AiRecommendationResponse> generateRecommendations(String hospitalId) {
        List<KpiSeries> series = hospitalId != null
                ? kpiSeriesRepository.findByHospitalId(hospitalId)
                : kpiSeriesRepository.findAll();
        return series.stream()
                .limit(5)
                .map(seriesEntry -> AiRecommendationResponse.builder()
                        .hospitalId(seriesEntry.getHospitalId())
                        .department(seriesEntry.getDepartment())
                        .metric(seriesEntry.getMetric())
                        .recommendation(pickRecommendation(seriesEntry.getMetric()))
                        .impact(pickImpact())
                        .build())
                .collect(Collectors.toList());
    }

    private String pickRecommendation(String metric) {
        String base = PLAYBOOK.get(ThreadLocalRandom.current().nextInt(PLAYBOOK.size()));
        return String.format("%s for metric %s", base, metric);
    }

    private String pickImpact() {
        double improvement = ThreadLocalRandom.current().nextDouble(3, 12);
        return String.format("Projected %.1f%% improvement", improvement);
    }
}
