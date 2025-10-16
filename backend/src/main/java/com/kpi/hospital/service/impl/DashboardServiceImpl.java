package com.kpi.hospital.service.impl;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.kpi.hospital.dto.DashboardSummaryResponse;
import com.kpi.hospital.model.FederatedLearningState;
import com.kpi.hospital.model.RoleType;
import com.kpi.hospital.model.User;
import com.kpi.hospital.repository.HospitalRepository;
import com.kpi.hospital.repository.KpiSeriesRepository;
import com.kpi.hospital.repository.UserRepository;
import com.kpi.hospital.service.AiService;
import com.kpi.hospital.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final KpiSeriesRepository kpiSeriesRepository;
    private final AiService aiService;

    @Override
    public DashboardSummaryResponse getSummaryForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        RoleType primaryRole = resolvePrimaryRole(user);
        boolean scopedToHospital = primaryRole == RoleType.MANAGER;
        String hospitalId = scopedToHospital && user.getHospital() != null ? user.getHospital().getId() : null;

        long totalHospitals = scopedToHospital && hospitalId != null ? 1L : hospitalRepository.count();
        long activeHospitals = scopedToHospital && hospitalId != null ? 1L
                : hospitalRepository.countByFederatedState(FederatedLearningState.ONLINE)
                        + hospitalRepository.countByFederatedState(FederatedLearningState.TRAINING);
        long monitoredKpis = scopedToHospital && hospitalId != null
                ? (long) kpiSeriesRepository.findByHospitalId(hospitalId).size()
                : kpiSeriesRepository.count();

        List<String> alerts = aiService.getAnomalies(hospitalId).stream()
                .limit(3)
                .map(anomaly -> String.format("%s in %s (%s) deviation %.2f", anomaly.getMetric(),
                        anomaly.getDepartment(), anomaly.getSeverity(), anomaly.getDeviation()))
                .collect(Collectors.toList());
        List<String> recommendations = aiService.getRecommendations(hospitalId).stream()
                .limit(3)
                .map(rec -> rec.getRecommendation())
                .collect(Collectors.toList());

        return DashboardSummaryResponse.builder()
                .totalHospitals(totalHospitals)
                .activeHospitals(activeHospitals)
                .monitoredKpis(monitoredKpis)
                .alerts(alerts)
                .recommendations(recommendations)
                .build();
    }

    private RoleType resolvePrimaryRole(User user) {
        Set<RoleType> roleTypes = user.getRoles() == null ? Set.of()
                : user.getRoles().stream().map(role -> role.getName()).collect(Collectors.toSet());
        if (roleTypes.contains(RoleType.ADMIN)) {
            return RoleType.ADMIN;
        }
        if (roleTypes.contains(RoleType.DIRECTOR)) {
            return RoleType.DIRECTOR;
        }
        return RoleType.MANAGER;
    }
}
