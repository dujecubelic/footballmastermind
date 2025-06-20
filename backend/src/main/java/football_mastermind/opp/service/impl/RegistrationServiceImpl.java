package football_mastermind.opp.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;
import football_mastermind.opp.service.RegistrationService;

@Service
public class RegistrationServiceImpl implements RegistrationService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public ResponseEntity<String> registerUserUsernamePassword(String username, String password) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		password = encoder.encode(password);
		FootballMastermindUser newUser = new FootballMastermindUser(null, username, password, false);
		if (userRepository.findByUsername(username).isEmpty()) {
			userRepository.save(newUser);
			userRepository.flush();
			return new ResponseEntity<String>("OK", HttpStatus.OK);
		}
		return new ResponseEntity<String>("That username is already taken", HttpStatus.FORBIDDEN);
	}

}
