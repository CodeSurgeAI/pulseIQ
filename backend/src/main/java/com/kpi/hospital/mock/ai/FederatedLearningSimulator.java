package com.kpi.hospital.mock.ai;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Component;

import com.kpi.hospital.dto.FederatedStatusResponse;
import com.kpi.hospital.model.FederatedLearningState;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.repository.HospitalRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class FederatedLearningSimulator {

    private static final Map<FederatedLearningState, String> STATUS_MESSAGES = Map.of(
            FederatedLearningState.ONLINE, "Participating in global round",
            FederatedLearningState.TRAINING, "Local training in progress",
            FederatedLearningState.OFFLINE, "Awaiting connectivity",
            FederatedLearningState.DEGRADED, "Reduced data quality detected");

    private final HospitalRepository hospitalRepository;

    public List<FederatedStatusResponse> getFederatedStatuses() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        return hospitals.stream()
                .map(this::buildStatus)
                .toList();
    }

    private FederatedStatusResponse buildStatus(Hospital hospital) {
        FederatedLearningState state = hospital.getFederatedState() != null
                ? hospital.getFederatedState()
                : pickState();
        return FederatedStatusResponse.builder()
                .hospitalId(hospital.getId())
                .state(state)
                .lastSync(Instant.now().minusSeconds(ThreadLocalRandom.current().nextLong(300, 7200)))
                .progress(ThreadLocalRandom.current().nextDouble(0, 100))
                .message(STATUS_MESSAGES.getOrDefault(state, ""))
                .build();
    }

    private FederatedLearningState pickState() {
        FederatedLearningState[] states = FederatedLearningState.values();
        return states[ThreadLocalRandom.current().nextInt(states.length)];
    }
}
