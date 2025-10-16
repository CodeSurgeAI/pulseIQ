package com.kpi.hospital.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Hospital KPI Management API",
                version = "1.0",
                description = "AI-powered KPIs, anomalies, and recommendations for hospitals",
                contact = @Contact(name = "Hospital KPI Platform", email = "support@hospital-kpi.ai")
        ),
        servers = @Server(url = "http://localhost:8080", description = "Local"))
public class OpenApiConfig {
}
