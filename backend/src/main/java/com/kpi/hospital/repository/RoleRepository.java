package com.kpi.hospital.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.kpi.hospital.model.Role;
import com.kpi.hospital.model.RoleType;

public interface RoleRepository extends MongoRepository<Role, String> {

    Optional<Role> findByName(RoleType name);
}
