package football_mastermind.opp.service.impl;

import football_mastermind.opp.dao.GamesRepository;
import football_mastermind.opp.domain.GameSession;
import football_mastermind.opp.service.GamesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GamesServiceImpl implements GamesService {

    private final GamesRepository gamesRepository;

    @Override
    public List<String> getAvailableGames() {
        return List.of("tic-tac-toe", "football-quiz", "penalty-shootout");
    }

    @Override
    public Object getGameConfig(String gameType) {
        // Fetch from file, DB, or hardcoded config
        return Map.of("maxPlayers", 2, "timeLimit", 60);
    }

    @Override
    public GameSession createSession(String gameType) {
        GameSession session = new GameSession();
        session.setGameType(gameType);
        session.setStatus("WAITING");
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        return gamesRepository.save(session);
    }

    @Override
    public GameSession getSession(String gameType, Long sessionId) {
        return gamesRepository.findByIdAndGameType(sessionId, gameType)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    @Override
    public void joinSession(String gameType, Long sessionId) {
        GameSession session = getSession(gameType, sessionId);
        // logic to add player to session
        session.setUpdatedAt(LocalDateTime.now());
        gamesRepository.save(session);
    }

    @Override
    public void submitAnswer(String gameType, Long sessionId, Map<String, Object> answer) {
        GameSession session = getSession(gameType, sessionId);
        // logic to process answer
        session.setUpdatedAt(LocalDateTime.now());
        gamesRepository.save(session);
    }

    @Override
    public void leaveSession(String gameType, Long sessionId) {
        GameSession session = getSession(gameType, sessionId);
        // logic to remove player
        session.setUpdatedAt(LocalDateTime.now());
        gamesRepository.save(session);
    }
}

