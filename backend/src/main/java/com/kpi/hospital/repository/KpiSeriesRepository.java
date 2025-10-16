package com.kpi.hospital.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.kpi.hospital.model.KpiSeries;

public interface KpiSeriesRepository extends MongoRepository<KpiSeries, String> {

    List<KpiSeries> findByHospitalId(String hospitalId);

    List<KpiSeries> findByHospitalIdAndDepartment(String hospitalId, String department);

    Optional<KpiSeries> findByHospitalIdAndDepartmentAndMetric(String hospitalId, String department, String metric);
}
