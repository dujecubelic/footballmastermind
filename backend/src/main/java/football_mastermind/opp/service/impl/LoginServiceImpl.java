package football_mastermind.opp.service.impl;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;
import football_mastermind.opp.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<Map<String, String>> loginUser(String username, String password) {
        Optional<FootballMastermindUser> optionalUser = userRepository.findByUsername(username);

        Map<String, String> response = new HashMap<>();

        if (optionalUser.isEmpty()) {
            response.put("message", "Invalid username or password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }

        FootballMastermindUser user = optionalUser.get();
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        if (encoder.matches(password, user.getPassword())) {
            response.put("message", "Login successful");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Invalid username or password");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}


