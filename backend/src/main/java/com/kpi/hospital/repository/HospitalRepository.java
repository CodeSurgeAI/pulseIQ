package com.kpi.hospital.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.kpi.hospital.model.FederatedLearningState;
import com.kpi.hospital.model.Hospital;

public interface HospitalRepository extends MongoRepository<Hospital, String> {

    Optional<Hospital> findByCode(String code);

    long countByFederatedState(FederatedLearningState state);
}
