package com.kpi.hospital.service;

import java.util.List;

import com.kpi.hospital.dto.HospitalRequest;
import com.kpi.hospital.dto.HospitalResponse;

public interface HospitalService {

    HospitalResponse createOrUpdateHospital(HospitalRequest request);

    List<HospitalResponse> getHospitals();

    HospitalResponse getHospital(String id);

    void deleteHospital(String id);
}
