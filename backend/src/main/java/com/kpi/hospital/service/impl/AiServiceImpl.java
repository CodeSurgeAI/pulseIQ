package com.kpi.hospital.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kpi.hospital.dto.AiAnomalyResponse;
import com.kpi.hospital.dto.AiPredictionResponse;
import com.kpi.hospital.dto.AiRecommendationResponse;
import com.kpi.hospital.dto.FederatedStatusResponse;
import com.kpi.hospital.dto.MlGatewayStatusResponse;
import com.kpi.hospital.mock.ai.AiAnomalyDetector;
import com.kpi.hospital.mock.ai.AiPredictionEngine;
import com.kpi.hospital.mock.ai.AiRecommendationEngine;
import com.kpi.hospital.mock.ai.FederatedLearningSimulator;
import com.kpi.hospital.mock.ai.MlGatewayClient;
import com.kpi.hospital.service.AiService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final AiPredictionEngine aiPredictionEngine;
    private final AiAnomalyDetector aiAnomalyDetector;
    private final AiRecommendationEngine aiRecommendationEngine;
    private final FederatedLearningSimulator federatedLearningSimulator;
    private final MlGatewayClient mlGatewayClient;

    @Override
    public List<AiPredictionResponse> getPredictions(String hospitalId) {
        return aiPredictionEngine.generatePredictions(hospitalId);
    }

    @Override
    public List<AiAnomalyResponse> getAnomalies(String hospitalId) {
        return aiAnomalyDetector.detectAnomalies(hospitalId);
    }

    @Override
    public List<AiRecommendationResponse> getRecommendations(String hospitalId) {
        return aiRecommendationEngine.generateRecommendations(hospitalId);
    }

    @Override
    public List<FederatedStatusResponse> getFederatedStatus() {
        return federatedLearningSimulator.getFederatedStatuses();
    }

    @Override
    public MlGatewayStatusResponse getMlGatewayStatus() {
        return mlGatewayClient.checkStatus();
    }
}
