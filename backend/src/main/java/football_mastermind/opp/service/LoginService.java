package football_mastermind.opp.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public interface LoginService {
    ResponseEntity<Map<String, String>> loginUser(String username, String password);
}
