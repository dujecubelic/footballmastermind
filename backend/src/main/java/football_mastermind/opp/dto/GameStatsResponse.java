package football_mastermind.opp.dto;

public class GameStatsResponse {
    public boolean success;
    public String message;
    public NewStats newStats;

    public static class NewStats {
        public int totalXP;
        public int level;
        public int xpToNextLevel;
        public int gamesPlayed;
        public String averageAccuracy;
        public String averageResponseTime;
    }
}
