package com.kpi.hospital.service.impl;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import com.kpi.hospital.dto.LeaderboardEntry;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.service.LeaderboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LeaderboardServiceImpl implements LeaderboardService {

    private final MongoTemplate mongoTemplate;
    private final com.kpi.hospital.repository.HospitalRepository hospitalRepository;

    @Override
    @SuppressWarnings("unchecked")
    public List<LeaderboardEntry> getLeaderboard() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.unwind("$history"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "history.timestamp")),
                Aggregation.group("hospitalId", "department", "metric")
                        .first("history.value").as("latestValue")
                        .first("hospitalId").as("hospitalId"),
                Aggregation.group("hospitalId")
                        .avg("latestValue").as("avgPerformance")
                        .count().as("kpiCount"),
                Aggregation.project("avgPerformance", "kpiCount")
                        .and("_id").as("hospitalId"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "avgPerformance", "kpiCount"))
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "kpi_series", Map.class);
        Map<String, Hospital> hospitalMap = hospitalRepository.findAll().stream()
                .collect(Collectors.toMap(Hospital::getId, h -> h));
        AtomicInteger rankCounter = new AtomicInteger(1);
        return results.getMappedResults().stream()
                .map(doc -> {
                    String hospitalId = (String) doc.get("hospitalId");
                    double avgPerformance = ((Number) doc.getOrDefault("avgPerformance", 0)).doubleValue();
                    Hospital hospital = hospitalMap.get(hospitalId);
                    return LeaderboardEntry.builder()
                            .hospitalId(hospitalId)
                            .hospitalName(hospital != null ? hospital.getName() : "Unknown")
                            .efficiencyScore(Math.round(avgPerformance * 100.0) / 100.0)
                            .rank(rankCounter.getAndIncrement())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
