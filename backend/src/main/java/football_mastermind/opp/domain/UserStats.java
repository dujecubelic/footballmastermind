package football_mastermind.opp.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // Foreign key to user table

    private int totalXp;
    private int level;
    private int gamesPlayed;
    private int totalCorrectAnswers;
    private int totalAnswers;
    private long totalTimeMs;

    public UserStats() {}

    public UserStats(Long userId) {
        this.userId = userId;
        this.totalXp = 0;
        this.level = 1;
        this.gamesPlayed = 0;
        this.totalCorrectAnswers = 0;
        this.totalAnswers = 0;
        this.totalTimeMs = 0;
    }

    // Getters and setters omitted for brevity
}

