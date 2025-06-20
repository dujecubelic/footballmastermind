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
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserStatsController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(401).body(createErrorMap("Not authenticated"));
            }

            String username = authentication.getName();
            Optional<FootballMastermindUser> optionalUser = userRepository.findByUsername(username);

            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(404).body(createErrorMap("User not found"));
            }

            FootballMastermindUser user = optionalUser.get();

            // For now, return placeholder stats
            // TODO: Replace with actual stats from database when player_stats table is implemented
            Map<String, Object> stats = new HashMap<>();
            stats.put("gamesPlayed", 0);
            stats.put("gamesWon", 0);
            stats.put("winRate", "0%");
            stats.put("highestScore", 0);
            stats.put("questionsAnswered", 0);
            stats.put("correctAnswers", 0);
            stats.put("accuracy", "0%");
            stats.put("rankPoints", 0);
            stats.put("rankTier", "Bronze");
            stats.put("level", 1);
            stats.put("xp", 0);
            stats.put("xpToNextLevel", 100);

            System.out.println("Retrieved stats for user: " + username);
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            System.err.println("Error getting user stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(createErrorMap("Failed to get user stats"));
        }
    }

    @GetMapping("/achievements")
    public ResponseEntity<?> getUserAchievements() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || !authentication.isAuthenticated() || 
                "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.status(401).body(createErrorMap("Not authenticated"));
            }

            String username = authentication.getName();
            
            // Placeholder achievements - will be replaced with actual database queries
            Map<String, Object> achievement1 = new HashMap<>();
            achievement1.put("id", "first-victory");
            achievement1.put("title", "First Victory");
            achievement1.put("description", "Win your first game");
            achievement1.put("completed", false);
            achievement1.put("progress", null);
            achievement1.put("icon", "trophy");

            Map<String, Object> achievement2 = new HashMap<>();
            achievement2.put("id", "perfect-score");
            achievement2.put("title", "Perfect Score");
            achievement2.put("description", "Answer all questions correctly in a game");
            achievement2.put("completed", false);
            achievement2.put("progress", null);
            achievement2.put("icon", "award");

            Map<String, Object> achievement3 = new HashMap<>();
            achievement3.put("id", "knowledge-master");
            achievement3.put("title", "Knowledge Master");
            achievement3.put("description", "Reach Gold rank");
            achievement3.put("completed", false);
            achievement3.put("progress", null);
            achievement3.put("icon", "medal");

            Map<String, Object> achievement4 = new HashMap<>();
            achievement4.put("id", "trivia-legend");
            achievement4.put("title", "Trivia Legend");
            achievement4.put("description", "Win 100 games");
            achievement4.put("completed", false);
            achievement4.put("progress", 0);
            achievement4.put("maxProgress", 100);
            achievement4.put("icon", "trophy");

            Map<String, Object> response = new HashMap<>();
            response.put("achievements", new Object[]{achievement1, achievement2, achievement3, achievement4});

            System.out.println("Retrieved achievements for user: " + username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error getting user achievements: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(createErrorMap("Failed to get user achievements"));
        }
    }

    private Map<String, Object> createErrorMap(String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", "Error");
        errorMap.put("message", message != null ? message : "Unknown error");
        return errorMap;
    }
}
