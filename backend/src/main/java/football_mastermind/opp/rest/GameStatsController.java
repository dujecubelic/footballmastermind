package football_mastermind.opp.rest;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;
import football_mastermind.opp.dto.GameStatsRequest;
import football_mastermind.opp.dto.GameStatsResponse;
import football_mastermind.opp.sec.UsernamePasswordService;
import football_mastermind.opp.service.GameStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game-stats")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GameStatsController {

    @Autowired
    private GameStatsService gameStatsService;

    @Autowired
    private UsernamePasswordService usernamePasswordService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public GameStatsResponse submitStats(@RequestBody GameStatsRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        FootballMastermindUser user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        Long userId = usernamePasswordService.getCurrentUserId();
        System.out.println(userId);
        return gameStatsService.submitStats(userId, request);
    }
}
