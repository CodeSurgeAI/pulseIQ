package com.kpi.hospital.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kpi.hospital.dto.HospitalRequest;
import com.kpi.hospital.dto.HospitalResponse;
import com.kpi.hospital.service.HospitalService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
@Validated
@Tag(name = "Hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR')")
    @Operation(summary = "List all hospitals")
    public ResponseEntity<List<HospitalResponse>> getHospitals() {
        return ResponseEntity.ok(hospitalService.getHospitals());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','DIRECTOR','MANAGER')")
    @Operation(summary = "Get hospital by id")
    public ResponseEntity<HospitalResponse> getHospital(@PathVariable String id) {
        return ResponseEntity.ok(hospitalService.getHospital(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a hospital")
    public ResponseEntity<HospitalResponse> createHospital(@Valid @RequestBody HospitalRequest request) {
        return ResponseEntity.ok(hospitalService.createOrUpdateHospital(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a hospital")
    public ResponseEntity<HospitalResponse> updateHospital(@PathVariable String id,
            @Valid @RequestBody HospitalRequest request) {
        request.setId(id);
        return ResponseEntity.ok(hospitalService.createOrUpdateHospital(request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete hospital")
    public ResponseEntity<Void> deleteHospital(@PathVariable String id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }
}
