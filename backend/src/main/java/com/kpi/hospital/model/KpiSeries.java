package com.kpi.hospital.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "kpi_series")
@CompoundIndex(name = "hospital_metric_idx", def = "{ 'hospitalId': 1, 'department': 1, 'metric': 1 }", unique = true)
public class KpiSeries extends AuditableDocument {

    @Id
    private String id;

    private String hospitalId;

    private String department;

    private String metric;

    private String unit;

    private BigDecimal target;

    @Builder.Default
    private List<KpiPoint> history = new ArrayList<>();
}
