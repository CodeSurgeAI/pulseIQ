package com.kpi.hospital.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kpi.hospital.dto.DashboardSummaryResponse;
import com.kpi.hospital.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Validated
@Tag(name = "Dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get role-aware dashboard summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(Principal principal) {
        return ResponseEntity.ok(dashboardService.getSummaryForUser(principal.getName()));
    }
}
