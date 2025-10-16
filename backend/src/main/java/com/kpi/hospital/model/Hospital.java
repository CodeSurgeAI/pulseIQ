package com.kpi.hospital.model;

import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "hospitals")
public class Hospital extends AuditableDocument {

    @Id
    private String id;

    private String name;

    private String code;

    private String address;

    private String city;

    private String country;

    private Set<String> departments;

    private String directorEmail;

    private FederatedLearningState federatedState;

    private Map<String, Object> metadata;
}
