package com.kpi.hospital.model;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User extends AuditableDocument {

    @Id
    private String id;

    private String email;

    private String password;

    private String fullName;

    private String title;

    @DBRef
    private Hospital hospital;

    @DBRef
    private Set<Role> roles;

    private boolean active;
}
