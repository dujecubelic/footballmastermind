package football_mastermind.opp.rest;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;
import football_mastermind.opp.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestParam String username,
            @RequestParam String password,
            HttpServletRequest request) {

        try {
            System.out.println("Login attempt for user: " + username);

            // First authenticate the user using Spring Security
            Authentication authRequest = new UsernamePasswordAuthenticationToken(username, password);
            Authentication authResult = authenticationManager.authenticate(authRequest);

            // Create and set security context
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authResult);
            SecurityContextHolder.setContext(securityContext);

            // Create session and store security context
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            System.out.println("Authentication successful for user: " + username);
            System.out.println("Session ID: " + session.getId());
            System.out.println("Security context stored in session");

            // Get user details from database
            Optional<FootballMastermindUser> optionalUser = userRepository.findByUsername(username);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(500).body(createErrorMap("User not found after authentication"));
            }

            FootballMastermindUser user = optionalUser.get();

            // Debug user fields to see which one is null
            System.out.println("User ID: " + user.getUserId());
            System.out.println("Username: " + user.getUsername());
            System.out.println("Email: " + user.getEmail());

            // Create response with null-safe values
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");

            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getUserId() != null ? user.getUserId() : 0);
            userMap.put("username", user.getUsername() != null ? user.getUsername() : "");
            userMap.put("email", user.getEmail() != null ? user.getEmail() : "");

            response.put("user", userMap);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            System.out.println("Bad credentials for user: " + username);
            return ResponseEntity.status(401).body(createErrorMap("Invalid username or password"));
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(createErrorMap("Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        // Debug session information
        HttpSession session = request.getSession(false);

        if (session == null) {
            System.out.println("No session found for /me request");
            return ResponseEntity.status(401).body(createErrorMap("No session found"));
        }

        System.out.println("Session ID: " + session.getId());
        System.out.println("Session creation time: " + new java.util.Date(session.getCreationTime()));
        System.out.println("Session last accessed: " + new java.util.Date(session.getLastAccessedTime()));

        // Debug session attributes
        Enumeration<String> attributeNames = session.getAttributeNames();
        System.out.println("Session attributes:");
        while (attributeNames.hasMoreElements()) {
            String name = attributeNames.nextElement();
            Object value = session.getAttribute(name);
            System.out.println("  " + name + " = " + value);
        }

        // Check Spring Security context in session
        SecurityContext securityContext = (SecurityContext) session.getAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY
        );

        if (securityContext == null) {
            System.out.println("No Spring Security context found in session");
            return ResponseEntity.status(401).body(createErrorMap("No security context in session"));
        }

        Authentication authentication = securityContext.getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            System.out.println("No valid authentication found");
            return ResponseEntity.status(401).body(createErrorMap("Not authenticated"));
        }

        String username = authentication.getName();
        System.out.println("Authenticated user: " + username);

        // Get user from database
        Optional<FootballMastermindUser> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            System.out.println("User not found in database: " + username);
            return ResponseEntity.status(401).body(createErrorMap("User not found"));
        }

        FootballMastermindUser user = optionalUser.get();

        // Create response with null-safe values
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getUserId() != null ? user.getUserId() : 0);
        response.put("username", user.getUsername() != null ? user.getUsername() : "");
        response.put("email", user.getEmail() != null ? user.getEmail() : "");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                System.out.println("Invalidating session: " + session.getId());
                session.invalidate();
            }

            SecurityContextHolder.clearContext();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Logout successful");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Logout error: " + e.getMessage());
            return ResponseEntity.status(500).body(createErrorMap("Logout failed"));
        }
    }

    // Helper method to create error maps safely
    private Map<String, Object> createErrorMap(String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("error", "Unauthorized");
        errorMap.put("message", message != null ? message : "Unknown error");
        return errorMap;
    }
}
