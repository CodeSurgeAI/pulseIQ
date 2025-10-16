package com.kpi.hospital.util;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.kpi.hospital.dto.HospitalResponse;
import com.kpi.hospital.dto.KpiResponse;
import com.kpi.hospital.dto.UserDto;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.model.KpiPoint;
import com.kpi.hospital.model.KpiSeries;
import com.kpi.hospital.model.User;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserDto toUserDto(User user) {
        Set<String> roles = user.getRoles() == null ? Set.of()
                : user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet());
        String hospitalId = user.getHospital() != null ? user.getHospital().getId() : null;
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .title(user.getTitle())
                .hospitalId(hospitalId)
                .roles(roles)
                .active(user.isActive())
                .build();
    }

    public static HospitalResponse toHospitalResponse(Hospital hospital) {
        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .code(hospital.getCode())
                .address(hospital.getAddress())
                .city(hospital.getCity())
                .country(hospital.getCountry())
                .departments(hospital.getDepartments())
                .directorEmail(hospital.getDirectorEmail())
                .federatedState(hospital.getFederatedState())
                .metadata(hospital.getMetadata())
                .build();
    }

    public static KpiResponse toKpiResponse(KpiSeries series) {
        List<KpiPoint> rawHistory = series.getHistory() == null ? Collections.emptyList() : series.getHistory();
        List<KpiResponse.KpiHistoryPoint> history = rawHistory.stream()
                .map(DtoMapper::toHistoryPoint)
                .collect(Collectors.toList());
        KpiPoint latest = rawHistory.isEmpty() ? null : rawHistory.get(rawHistory.size() - 1);
        return KpiResponse.builder()
                .id(series.getId())
                .hospitalId(series.getHospitalId())
                .department(series.getDepartment())
                .metric(series.getMetric())
                .unit(series.getUnit())
                .target(series.getTarget())
                .latestValue(latest == null ? null : latest.getValue())
                .latestTimestamp(latest == null ? null : latest.getTimestamp())
                .history(history)
                .build();
    }

    private static KpiResponse.KpiHistoryPoint toHistoryPoint(KpiPoint point) {
        return KpiResponse.KpiHistoryPoint.builder()
                .timestamp(point.getTimestamp())
                .value(point.getValue())
                .note(point.getNote())
                .submittedBy(point.getSubmittedBy())
                .build();
    }
}
