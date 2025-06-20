package football_mastermind.opp.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import football_mastermind.opp.domain.FootballMastermindUser;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<FootballMastermindUser, Long> {

    Optional<FootballMastermindUser> findByUsername(String username);
    Optional<FootballMastermindUser> findByUsernameAndPassword(String username, String password);
    Optional<FootballMastermindUser> findByEmail(String email);
    Optional<FootballMastermindUser> findByUserId(Long id);
}
