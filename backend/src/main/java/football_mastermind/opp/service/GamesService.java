package football_mastermind.opp.service;

import football_mastermind.opp.domain.GameSession;

import java.util.List;
import java.util.Map;

public interface GamesService {
    List<String> getAvailableGames();
    Object getGameConfig(String gameType);
    GameSession createSession(String gameType);
    GameSession getSession(String gameType, Long sessionId);
    void joinSession(String gameType, Long sessionId);
    void submitAnswer(String gameType, Long sessionId, Map<String, Object> answer);
    void leaveSession(String gameType, Long sessionId);
}

