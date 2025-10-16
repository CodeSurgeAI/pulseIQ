package com.kpi.hospital.service;

import java.util.List;

import com.kpi.hospital.dto.AiAnomalyResponse;
import com.kpi.hospital.dto.AiPredictionResponse;
import com.kpi.hospital.dto.AiRecommendationResponse;
import com.kpi.hospital.dto.FederatedStatusResponse;
import com.kpi.hospital.dto.MlGatewayStatusResponse;

public interface AiService {

    List<AiPredictionResponse> getPredictions(String hospitalId);

    List<AiAnomalyResponse> getAnomalies(String hospitalId);

    List<AiRecommendationResponse> getRecommendations(String hospitalId);

    List<FederatedStatusResponse> getFederatedStatus();

    MlGatewayStatusResponse getMlGatewayStatus();
}
