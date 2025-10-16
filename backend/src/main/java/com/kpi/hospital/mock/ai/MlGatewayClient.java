package com.kpi.hospital.mock.ai;

import java.time.Instant;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Component;

import com.kpi.hospital.dto.MlGatewayStatusResponse;

@Component
public class MlGatewayClient {

    private Instant lastHeartbeat = Instant.now();

    public MlGatewayStatusResponse checkStatus() {
        boolean reachable = ThreadLocalRandom.current().nextDouble() > 0.1;
        if (reachable) {
            lastHeartbeat = Instant.now();
        }
        String message = reachable ? "Python ML pipeline reachable" : "ML pipeline unreachable - retrying";
        return MlGatewayStatusResponse.builder()
                .reachable(reachable)
                .lastHeartbeat(lastHeartbeat)
                .message(message)
                .build();
    }
}
