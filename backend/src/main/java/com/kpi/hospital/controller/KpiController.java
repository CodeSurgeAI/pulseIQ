package com.kpi.hospital.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kpi.hospital.dto.KpiResponse;
import com.kpi.hospital.dto.KpiSubmissionRequest;
import com.kpi.hospital.service.KpiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/kpis")
@RequiredArgsConstructor
@Validated
@Tag(name = "KPIs")
public class KpiController {

    private final KpiService kpiService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @Operation(summary = "Submit or update KPI value")
    public ResponseEntity<KpiResponse> submitKpi(@Valid @RequestBody KpiSubmissionRequest request, Principal principal) {
        return ResponseEntity.ok(kpiService.submitKpi(request, principal.getName()));
    }

    @GetMapping("/history/{hospitalId}")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get KPI history for hospital")
    public ResponseEntity<List<KpiResponse>> getHistory(@PathVariable String hospitalId) {
        return ResponseEntity.ok(kpiService.getKpiHistoryByHospital(hospitalId));
    }
}
