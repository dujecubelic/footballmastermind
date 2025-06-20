package football_mastermind.opp.dto;

public class GameStatsRequest {
    public String gameMode;
    public String gameType;
    public String difficulty;
    public String category;
    public int correctAnswers;
    public int totalAnswers;
    public long averageTimeMs;
    public double accuracy;
    public int xpEarned;
    public int eloChange;
    public long sessionDurationMs;
}
