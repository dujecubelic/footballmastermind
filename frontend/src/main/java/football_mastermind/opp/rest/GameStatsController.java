package football_mastermind.opp.rest;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/game-stats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GameStatsController {

    @Autowired
    private UserRepository userRepository;

    // Request model for submitting game stats
    public static class GameStatsRequest {
        private String gameMode; // "training", "ranked", "casual"
        private String gameType; // "trivia", "tic-tac-toe", "category-grid"
        private String difficulty; // "easy", "medium", "hard"
        private String category;
        private int correctAnswers;
        private int totalAnswers;
        private long averageTimeMs;
        private double accuracy; // percentage (0-100)
        private int xpEarned;
        private Integer eloChange; // for ranked games
        private Boolean isWinner;
        private long sessionDurationMs;

        // Constructors
        public GameStatsRequest() {}

        // Getters and setters
        public String getGameMode() { return gameMode; }
        public void setGameMode(String gameMode) { this.gameMode = gameMode; }

        public String getGameType() { return gameType; }
        public void setGameType(String gameType) { this.gameType = gameType; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public int getCorrectAnswers() { return correctAnswers; }
        public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

        public int getTotalAnswers() { return totalAnswers; }
        public void setTotalAnswers(int totalAnswers) { this.totalAnswers = totalAnswers; }

        public long getAverageTimeMs() { return averageTimeMs; }
        public void setAverageTimeMs(long averageTimeMs) { this.averageTimeMs = averageTimeMs; }

        public double getAccuracy() { return accuracy; }
        public void setAccuracy(double accuracy) { this.accuracy = accuracy; }

        public int getXpEarned() { return xpEarned; }
        public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }

        public Integer getEloChange() { return eloChange; }
        public void setEloChange(Integer eloChange) { this.eloChange = eloChange; }

        public Boolean getIsWinner() { return isWinner; }
        public void setIsWinner(Boolean isWinner) { this.isWinner = isWinner; }

        public long getSessionDurationMs() { return sessionDurationMs; }
        public void setSessionDurationMs(long sessionDurationMs) { this.sessionDurationMs = sessionDurationMs; }
    }

    // Response model for game stats submission
    public static class GameStatsResponse {
        private boolean success;
        private String message;
        private Map<String, Object> newStats;

        public GameStatsResponse() {}

        public GameStatsResponse(boolean success, String message, Map<String, Object> newStats) {
            this.success = success;
            this.message = message;
            this.newStats = newStats;
        }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Map<String, Object> getNewStats() { return newStats; }
        public void setNewStats(Map<String, Object> newStats) { this.newStats = newStats; }
    }

    // XP Breakdown request model
    public static class XPBreakdownRequest {
        private int correctAnswers;
        private int totalAnswers;
        private long averageTimeMs;
        private String difficulty;
        private String gameMode;
        private Boolean isWinner;

        // Constructors
        public XPBreakdownRequest() {}

        // Getters and setters
        public int getCorrectAnswers() { return correctAnswers; }
        public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

        public int getTotalAnswers() { return totalAnswers; }
        public void setTotalAnswers(int totalAnswers) { this.totalAnswers = totalAnswers; }

        public long getAverageTimeMs() { return averageTimeMs; }
        public void setAverageTimeMs(long averageTimeMs) { this.averageTimeMs = averageTimeMs; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

        public String getGameMode() { return gameMode; }
        public void setGameMode(String gameMode) { this.gameMode = gameMode; }

        public Boolean getIsWinner() { return isWinner; }
        public void setIsWinner(Boolean isWinner) { this.isWinner = isWinner; }
    }

    // XP Breakdown response model
    public static class XPBreakdownResponse {
        private int baseXP;
        private int difficultyBonus;
        private int speedBonus;
        private int accuracyBonus;
        private int winBonus;
        private int totalXP;
        private Map<String, String> breakdown;

        public XPBreakdownResponse() {}

        public XPBreakdownResponse(int baseXP, int difficultyBonus, int speedBonus, int accuracyBonus, 
                                 int winBonus, int totalXP, Map<String, String> breakdown) {
            this.baseXP = baseXP;
            this.difficultyBonus = difficultyBonus;
            this.speedBonus = speedBonus;
            this.accuracyBonus = accuracyBonus;
            this.winBonus = winBonus;
            this.totalXP = totalXP;
            this.breakdown = breakdown;
        }

        // Getters and setters
        public int getBaseXP() { return baseXP; }
        public void setBaseXP(int baseXP) { this.baseXP = baseXP; }

        public int getDifficultyBonus() { return difficultyBonus; }
        public void setDifficultyBonus(int difficultyBonus) { this.difficultyBonus = difficultyBonus; }

        public int getSpeedBonus() { return speedBonus; }
        public void setSpeedBonus(int speedBonus) { this.speedBonus = speedBonus; }

        public int getAccuracyBonus() { return accuracyBonus; }
        public void setAccuracyBonus(int accuracyBonus) { this.accuracyBonus = accuracyBonus; }

        public int getWinBonus() { return winBonus; }
        public void setWinBonus(int winBonus) { this.winBonus = winBonus; }

        public int getTotalXP() { return totalXP; }
        public void setTotalXP(int totalXP) { this.totalXP = totalXP; }

        public Map<String, String> getBreakdown() { return breakdown; }
        public void setBreakdown(Map<String, String> breakdown) { this.breakdown = breakdown; }
    }

    @PostMapping("/submit")
    public ResponseEntity<GameStatsResponse> submitGameStats(@RequestBody GameStatsRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(401).body(
                    new GameStatsResponse(false, "Not authenticated", null)
                );
            }

            String username = authentication.getName();
            Optional<FootballMastermindUser> optionalUser = userRepository.findByUsername(username);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(
                    new GameStatsResponse(false, "User not found", null)
                );
            }

            FootballMastermindUser user = optionalUser.get();

            System.out.println("Submitting game stats for user: " + username);
            System.out.println("Game Mode: " + request.getGameMode());
            System.out.println("Game Type: " + request.getGameType());
            System.out.println("Difficulty: " + request.getDifficulty());
            System.out.println("Category: " + request.getCategory());
            System.out.println("Correct Answers: " + request.getCorrectAnswers() + "/" + request.getTotalAnswers());
            System.out.println("Accuracy: " + request.getAccuracy() + "%");
            System.out.println("Average Time: " + request.getAverageTimeMs() + "ms");
            System.out.println("XP Earned: " + request.getXpEarned());
            if (request.getEloChange() != null) {
                System.out.println("Elo Change: " + request.getEloChange());
            }
            if (request.getIsWinner() != null) {
                System.out.println("Is Winner: " + request.getIsWinner());
            }

            // TODO: Store these stats in the database when player_stats table is implemented
            // For now, we'll just calculate and return updated placeholder stats

            // Calculate new stats (placeholder logic)
            Map<String, Object> newStats = calculateUpdatedStats(request);

            GameStatsResponse response = new GameStatsResponse(
                true, 
                "Game stats submitted successfully", 
                newStats
            );

            System.out.println("Game stats submitted successfully for user: " + username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error submitting game stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                new GameStatsResponse(false, "Failed to submit game stats: " + e.getMessage(), null)
            );
        }
    }

    @PostMapping("/calculate-xp")
    public ResponseEntity<XPBreakdownResponse> calculateXPBreakdown(@RequestBody XPBreakdownRequest request) {
        try {
            System.out.println("Calculating XP breakdown:");
            System.out.println("Correct Answers: " + request.getCorrectAnswers() + "/" + request.getTotalAnswers());
            System.out.println("Average Time: " + request.getAverageTimeMs() + "ms");
            System.out.println("Difficulty: " + request.getDifficulty());
            System.out.println("Game Mode: " + request.getGameMode());
            System.out.println("Is Winner: " + request.getIsWinner());

            // Calculate XP breakdown using the same logic as frontend
            XPBreakdownResponse breakdown = calculateXPBreakdown(
                request.getCorrectAnswers(),
                request.getTotalAnswers(),
                request.getAverageTimeMs(),
                request.getDifficulty(),
                request.getGameMode(),
                request.getIsWinner() != null ? request.getIsWinner() : false
            );

            System.out.println("Calculated total XP: " + breakdown.getTotalXP());
            return ResponseEntity.ok(breakdown);

        } catch (Exception e) {
            System.err.println("Error calculating XP breakdown: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new XPBreakdownResponse());
        }
    }

    private Map<String, Object> calculateUpdatedStats(GameStatsRequest request) {
        // Placeholder calculation - replace with actual database queries when implemented
        Map<String, Object> stats = new HashMap<>();
        
        // Calculate level from XP (100 XP per level)
        int totalXP = request.getXpEarned(); // In real implementation, add to existing XP
        int level = (totalXP / 100) + 1;
        int xpToNextLevel = 100 - (totalXP % 100);
        
        stats.put("totalXP", totalXP);
        stats.put("level", level);
        stats.put("xpToNextLevel", xpToNextLevel);
        stats.put("gamesPlayed", 1); // Placeholder
        stats.put("gamesWon", request.getIsWinner() != null && request.getIsWinner() ? 1 : 0);
        stats.put("winRate", request.getIsWinner() != null && request.getIsWinner() ? "100%" : "0%");
        stats.put("averageAccuracy", String.format("%.1f%%", request.getAccuracy()));
        stats.put("averageResponseTime", String.format("%.1fs", request.getAverageTimeMs() / 1000.0));
        
        if ("ranked".equals(request.getGameMode())) {
            stats.put("rankPoints", request.getEloChange() != null ? request.getEloChange() : 0);
            stats.put("rankTier", "Bronze"); // Placeholder
        }
        
        return stats;
    }

    private XPBreakdownResponse calculateXPBreakdown(int correctAnswers, int totalAnswers, long averageTimeMs, 
                                                   String difficulty, String gameMode, boolean isWinner) {
        // Base XP calculation
        int baseXP = correctAnswers * 10;
        
        // Difficulty multipliers
        double difficultyMultiplier = switch (difficulty.toLowerCase()) {
            case "easy" -> 1.0;
            case "medium" -> 1.5;
            case "hard" -> 2.0;
            default -> 1.0;
        };
        int difficultyBonus = (int) Math.round(baseXP * (difficultyMultiplier - 1));
        
        // Speed bonus calculation
        double averageTimeSeconds = averageTimeMs / 1000.0;
        int speedBonus = calculateSpeedBonus(baseXP, averageTimeSeconds);
        
        // Accuracy bonus calculation
        double accuracy = totalAnswers > 0 ? (correctAnswers * 100.0 / totalAnswers) : 0;
        int accuracyBonus = calculateAccuracyBonus(baseXP, accuracy);
        
        // Win bonus for ranked games
        int winBonus = "ranked".equals(gameMode) && isWinner ? (int) Math.round(baseXP * 0.25) : 0;
        
        // Total XP
        int totalXP = baseXP + difficultyBonus + speedBonus + accuracyBonus + winBonus;
        
        // Create breakdown descriptions
        Map<String, String> breakdown = new HashMap<>();
        breakdown.put("base", correctAnswers + " correct × 10 XP = " + baseXP + " XP");
        breakdown.put("difficulty", difficulty + " difficulty × " + difficultyMultiplier + " = +" + difficultyBonus + " XP");
        breakdown.put("speed", getSpeedBonusDescription(averageTimeSeconds, speedBonus));
        breakdown.put("accuracy", getAccuracyBonusDescription(accuracy, accuracyBonus));
        breakdown.put("win", isWinner && "ranked".equals(gameMode) ? "Victory bonus = +" + winBonus + " XP" : "");
        
        return new XPBreakdownResponse(baseXP, difficultyBonus, speedBonus, accuracyBonus, winBonus, totalXP, breakdown);
    }
    
    private int calculateSpeedBonus(int baseXP, double averageTimeSeconds) {
        if (averageTimeSeconds <= 3) {
            return (int) Math.round(baseXP * 0.5); // +50% for under 3 seconds
        } else if (averageTimeSeconds <= 6) {
            return (int) Math.round(baseXP * 0.25); // +25% for under 6 seconds
        } else if (averageTimeSeconds <= 10) {
            return (int) Math.round(baseXP * 0.1); // +10% for under 10 seconds
        }
        return 0;
    }
    
    private int calculateAccuracyBonus(int baseXP, double accuracy) {
        if (accuracy >= 100) {
            return (int) Math.round(baseXP * 0.5); // +50% for perfect
        } else if (accuracy >= 90) {
            return (int) Math.round(baseXP * 0.3); // +30% for 90%+
        } else if (accuracy >= 75) {
            return (int) Math.round(baseXP * 0.15); // +15% for 75%+
        } else if (accuracy >= 60) {
            return (int) Math.round(baseXP * 0.05); // +5% for 60%+
        }
        return 0;
    }
    
    private String getSpeedBonusDescription(double averageTimeSeconds, int bonus) {
        if (averageTimeSeconds <= 3) {
            return "Lightning fast (" + String.format("%.1f", averageTimeSeconds) + "s avg) = +" + bonus + " XP";
        } else if (averageTimeSeconds <= 6) {
            return "Quick responses (" + String.format("%.1f", averageTimeSeconds) + "s avg) = +" + bonus + " XP";
        } else if (averageTimeSeconds <= 10) {
            return "Good speed (" + String.format("%.1f", averageTimeSeconds) + "s avg) = +" + bonus + " XP";
        }
        return "No speed bonus (" + String.format("%.1f", averageTimeSeconds) + "s avg)";
    }
    
    private String getAccuracyBonusDescription(double accuracy, int bonus) {
        if (accuracy >= 100) {
            return "Perfect accuracy (" + Math.round(accuracy) + "%) = +" + bonus + " XP";
        } else if (accuracy >= 90) {
            return "Excellent accuracy (" + Math.round(accuracy) + "%) = +" + bonus + " XP";
        } else if (accuracy >= 75) {
            return "Good accuracy (" + Math.round(accuracy) + "%) = +" + bonus + " XP";
        } else if (accuracy >= 60) {
            return "Decent accuracy (" + Math.round(accuracy) + "%) = +" + bonus + " XP";
        }
        return "No accuracy bonus (" + Math.round(accuracy) + "%)";
    }

    private Map<String, Object> createErrorMap(String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", "Error");
        errorMap.put("message", message != null ? message : "Unknown error");
        return errorMap;
    }
}
