package football_mastermind.opp.service;

import football_mastermind.opp.dto.GameStatsRequest;
import football_mastermind.opp.dto.GameStatsResponse;

public interface GameStatsService {
    GameStatsResponse submitStats(Long userId, GameStatsRequest request);
}
