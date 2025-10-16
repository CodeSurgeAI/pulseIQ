package com.kpi.hospital.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kpi.hospital.dto.AiAnomalyResponse;
import com.kpi.hospital.dto.AiPredictionResponse;
import com.kpi.hospital.dto.AiRecommendationResponse;
import com.kpi.hospital.dto.FederatedStatusResponse;
import com.kpi.hospital.service.AiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Validated
@Tag(name = "AI Insights")
public class AiController {

    private final AiService aiService;

    @GetMapping("/predictions")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get AI predictions for KPIs")
    public ResponseEntity<List<AiPredictionResponse>> getPredictions(@RequestParam(required = false) String hospitalId) {
        return ResponseEntity.ok(aiService.getPredictions(hospitalId));
    }

    @GetMapping("/anomalies")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get AI-detected anomalies")
    public ResponseEntity<List<AiAnomalyResponse>> getAnomalies(@RequestParam(required = false) String hospitalId) {
        return ResponseEntity.ok(aiService.getAnomalies(hospitalId));
    }

    @GetMapping("/recommendations")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get AI recommendations")
    public ResponseEntity<List<AiRecommendationResponse>> getRecommendations(
            @RequestParam(required = false) String hospitalId) {
        return ResponseEntity.ok(aiService.getRecommendations(hospitalId));
    }

    @GetMapping("/federated-status")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR')")
    @Operation(summary = "Get federated learning status for hospitals")
    public ResponseEntity<List<FederatedStatusResponse>> getFederatedStatus() {
        return ResponseEntity.ok(aiService.getFederatedStatus());
    }
}
