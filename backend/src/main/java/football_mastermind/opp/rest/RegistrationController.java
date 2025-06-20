package football_mastermind.opp.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import football_mastermind.opp.service.RegistrationService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/register")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RegistrationController {
	
	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private AuthenticationManager authenticationManager;

	@PostMapping
	public ResponseEntity<Map<String, String>> registerUsernamePassword(
			@RequestParam String username,
			@RequestParam String password,
			HttpServletRequest request) {

		registrationService.registerUserUsernamePassword(username, password);

		UsernamePasswordAuthenticationToken authToken =
				new UsernamePasswordAuthenticationToken(username, password);

		Authentication authentication = authenticationManager.authenticate(authToken);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		HttpSession session = request.getSession(true);
		session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
				SecurityContextHolder.getContext());

		Map<String, String> response = new HashMap<>();
		response.put("message", "User registered and logged in successfully");

		return ResponseEntity.ok(response);
	}
/*
	@PostMapping("/register")
	public ResponseEntity<?> register(
			@RequestParam String username,
			@RequestParam String password,
			HttpServletRequest request) {

		try {
			// Use your existing LoginService for registration
			ResponseEntity<Map<String, String>> result = loginService.registerUser(username, password);

			// If registration successful, automatically log the user in
			if (result.getStatusCode() == HttpStatus.OK) {
				return login(username, password, request);
			}

			return result;

		} catch (Exception e) {
			System.err.println("Registration error: " + e.getMessage());
			return ResponseEntity.status(500).body(Map.of("error", "Registration failed: " + e.getMessage()));
		}
	}
	*/
}
