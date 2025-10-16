package com.kpi.hospital.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kpi.hospital.dto.HospitalRequest;
import com.kpi.hospital.dto.HospitalResponse;
import com.kpi.hospital.model.Hospital;
import com.kpi.hospital.repository.HospitalRepository;
import com.kpi.hospital.service.HospitalService;
import com.kpi.hospital.util.DtoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    @Override
    @Transactional
    public HospitalResponse createOrUpdateHospital(HospitalRequest request) {
        Hospital hospital;
        if (request.getId() != null) {
            hospital = hospitalRepository.findById(request.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
        } else {
            hospital = new Hospital();
        }
        hospital.setName(request.getName());
        hospital.setCode(request.getCode());
        hospital.setAddress(request.getAddress());
        hospital.setCity(request.getCity());
        hospital.setCountry(request.getCountry());
        hospital.setDepartments(request.getDepartments());
        hospital.setDirectorEmail(request.getDirectorEmail());
        hospital.setFederatedState(request.getFederatedState());
        hospital.setMetadata(request.getMetadata());
        Hospital saved = hospitalRepository.save(hospital);
        return DtoMapper.toHospitalResponse(saved);
    }

    @Override
    public List<HospitalResponse> getHospitals() {
        return hospitalRepository.findAll().stream()
                .map(DtoMapper::toHospitalResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HospitalResponse getHospital(String id) {
        return hospitalRepository.findById(id)
                .map(DtoMapper::toHospitalResponse)
                .orElseThrow(() -> new IllegalArgumentException("Hospital not found"));
    }

    @Override
    public void deleteHospital(String id) {
        hospitalRepository.deleteById(id);
    }
}
