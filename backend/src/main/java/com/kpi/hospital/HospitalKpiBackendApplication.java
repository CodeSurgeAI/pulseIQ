package com.kpi.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class HospitalKpiBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalKpiBackendApplication.class, args);
    }
}
