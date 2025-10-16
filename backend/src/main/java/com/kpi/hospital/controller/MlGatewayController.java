package com.kpi.hospital.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kpi.hospital.dto.MlGatewayStatusResponse;
import com.kpi.hospital.service.AiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ml-gateway")
@RequiredArgsConstructor
@Validated
@Tag(name = "ML Gateway")
public class MlGatewayController {

    private final AiService aiService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR')")
    @Operation(summary = "Check simulated ML gateway health")
    public ResponseEntity<MlGatewayStatusResponse> getStatus() {
        return ResponseEntity.ok(aiService.getMlGatewayStatus());
    }
}
