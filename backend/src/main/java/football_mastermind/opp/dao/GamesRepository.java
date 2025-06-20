package football_mastermind.opp.dao;

import football_mastermind.opp.domain.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GamesRepository extends JpaRepository<GameSession, Long> {
    Optional<GameSession> findByIdAndGameType(Long id, String gameType);
}

