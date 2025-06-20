package football_mastermind.opp.service.impl;

import football_mastermind.opp.dao.UserStatsRepository;
import football_mastermind.opp.domain.UserStats;
import football_mastermind.opp.dto.GameStatsRequest;
import football_mastermind.opp.dto.GameStatsResponse;
import football_mastermind.opp.service.GameStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameStatsServiceImpl implements GameStatsService {

    @Autowired
    private UserStatsRepository statsRepository;

    @Override
    public GameStatsResponse submitStats(Long userId, GameStatsRequest request) {
        UserStats stats = statsRepository.findByUserId(userId)
                .orElseGet(() -> new UserStats(userId));

        stats.setGamesPlayed(stats.getGamesPlayed() + 1);
        stats.setTotalXp(stats.getTotalXp() + request.xpEarned);
        stats.setTotalCorrectAnswers(stats.getTotalCorrectAnswers() + request.correctAnswers);
        stats.setTotalAnswers(stats.getTotalAnswers() + request.totalAnswers);
        stats.setTotalTimeMs(stats.getTotalTimeMs() + (request.averageTimeMs * request.totalAnswers));

        int level = calculateLevel(stats.getTotalXp());
        int xpToNext = xpForNextLevel(level + 1) - stats.getTotalXp();

        stats.setLevel(level);
        statsRepository.save(stats);

        GameStatsResponse.NewStats newStats = new GameStatsResponse.NewStats();
        newStats.totalXP = stats.getTotalXp();
        newStats.level = level;
        newStats.xpToNextLevel = Math.max(0, xpToNext);
        newStats.gamesPlayed = stats.getGamesPlayed();

        double avgAccuracy = 100.0 * stats.getTotalCorrectAnswers() / stats.getTotalAnswers();
        double avgResponseTime = stats.getTotalTimeMs() / (double) stats.getTotalAnswers();

        newStats.averageAccuracy = String.format("%.1f%%", avgAccuracy);
        newStats.averageResponseTime = String.format("%.1fs", avgResponseTime / 1000.0);

        GameStatsResponse response = new GameStatsResponse();
        response.success = true;
        response.message = "Game stats submitted successfully";
        response.newStats = newStats;
        return response;
    }

    private int calculateLevel(int totalXp) {
        return (int) Math.floor(Math.sqrt(totalXp / 100.0)) + 1;
    }

    private int xpForNextLevel(int level) {
        return (int) Math.pow(level - 1, 2) * 100;
    }
}
