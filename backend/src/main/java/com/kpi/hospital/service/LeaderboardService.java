package com.kpi.hospital.service;

import java.util.List;

import com.kpi.hospital.dto.LeaderboardEntry;

public interface LeaderboardService {

    List<LeaderboardEntry> getLeaderboard();
}
