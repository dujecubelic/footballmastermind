package football_mastermind.opp.rest;


import football_mastermind.opp.domain.GameSession;
import football_mastermind.opp.service.GamesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GamesController {

    private final GamesService gamesService;

    @GetMapping
    public List<String> getAllAvailableGames() {
        return gamesService.getAvailableGames();
    }

    @GetMapping("/{gameType}/config")
    public ResponseEntity<?> getGameConfig(@PathVariable String gameType) {
        return ResponseEntity.ok(gamesService.getGameConfig(gameType));
    }

    @PostMapping("/{gameType}/sessions")
    public ResponseEntity<GameSession> createSession(@PathVariable String gameType) {
        return ResponseEntity.ok(gamesService.createSession(gameType));
    }

    @GetMapping("/{gameType}/sessions/{id}")
    public ResponseEntity<GameSession> getSession(@PathVariable String gameType, @PathVariable Long id) {
        return ResponseEntity.ok(gamesService.getSession(gameType, id));
    }

    @PostMapping("/{gameType}/sessions/{id}/join")
    public ResponseEntity<?> joinSession(@PathVariable String gameType, @PathVariable Long id) {
        gamesService.joinSession(gameType, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{gameType}/sessions/{id}/answer")
    public ResponseEntity<?> submitAnswer(@PathVariable String gameType, @PathVariable Long id, @RequestBody Map<String, Object> answer) {
        gamesService.submitAnswer(gameType, id, answer);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{gameType}/sessions/{id}/leave")
    public ResponseEntity<?> leaveSession(@PathVariable String gameType, @PathVariable Long id) {
        gamesService.leaveSession(gameType, id);
        return ResponseEntity.ok().build();
    }
}

