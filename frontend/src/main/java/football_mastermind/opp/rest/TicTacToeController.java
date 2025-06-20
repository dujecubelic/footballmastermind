package football_mastermind.opp.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/tictactoe")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TicTacToeController {

    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            // Return categories for rows and columns with specific values
            Map<String, Object> response = new HashMap<>();
            
            // Row categories - mix of clubs, countries, etc.
            List<Map<String, String>> rowCategories = Arrays.asList(
                Map.of("id", "club", "name", "Barcelona"),
                Map.of("id", "country", "name", "Brazil"),
                Map.of("id", "club", "name", "Man Utd")
            );
            
            // Column categories - mix of clubs, trophies, etc.
            List<Map<String, String>> colCategories = Arrays.asList(
                Map.of("id", "club", "name", "Bayern"),
                Map.of("id", "trophy", "name", "World Cup"),
                Map.of("id", "club", "name", "Real Madrid")
            );
            
            response.put("rowCategories", rowCategories);
            response.put("colCategories", colCategories);
            
            System.out.println("Retrieved tic-tac-toe categories");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting categories: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get categories"));
        }
    }

    // Request form for cell-solutions
    public static class CellSolutionsRequest {
        private String rowCategoryId;
        private String rowCategoryName;
        private String colCategoryId;
        private String colCategoryName;

        // Constructors
        public CellSolutionsRequest() {}

        public CellSolutionsRequest(String rowCategoryId, String rowCategoryName, 
                                  String colCategoryId, String colCategoryName) {
            this.rowCategoryId = rowCategoryId;
            this.rowCategoryName = rowCategoryName;
            this.colCategoryId = colCategoryId;
            this.colCategoryName = colCategoryName;
        }

        // Getters and setters
        public String getRowCategoryId() { return rowCategoryId; }
        public void setRowCategoryId(String rowCategoryId) { this.rowCategoryId = rowCategoryId; }

        public String getRowCategoryName() { return rowCategoryName; }
        public void setRowCategoryName(String rowCategoryName) { this.rowCategoryName = rowCategoryName; }

        public String getColCategoryId() { return colCategoryId; }
        public void setColCategoryId(String colCategoryId) { this.colCategoryId = colCategoryId; }

        public String getColCategoryName() { return colCategoryName; }
        public void setColCategoryName(String colCategoryName) { this.colCategoryName = colCategoryName; }
    }

    // Response form for cell-solutions
    public static class CellSolutionsResponse {
        private List<PlayerSolution> solutions;
        private int count;
        private String message;

        // Constructors
        public CellSolutionsResponse() {}

        public CellSolutionsResponse(List<PlayerSolution> solutions, int count, String message) {
            this.solutions = solutions;
            this.count = count;
            this.message = message;
        }

        // Getters and setters
        public List<PlayerSolution> getSolutions() { return solutions; }
        public void setSolutions(List<PlayerSolution> solutions) { this.solutions = solutions; }

        public int getCount() { return count; }
        public void setCount(int count) { this.count = count; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    // Player solution model
    public static class PlayerSolution {
        private String id;
        private String name;
        private String details;
        private String imageUrl;

        // Constructors
        public PlayerSolution() {}

        public PlayerSolution(String id, String name, String details, String imageUrl) {
            this.id = id;
            this.name = name;
            this.details = details;
            this.imageUrl = imageUrl;
        }

        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    @PostMapping("/cell-solutions")
    public ResponseEntity<CellSolutionsResponse> getCellSolutions(@RequestBody CellSolutionsRequest request) {
        try {
            System.out.println("Getting solutions for: " + request.getRowCategoryName() + " × " + request.getColCategoryName());
            
            // Return all valid player solutions for this cell combination
            List<PlayerSolution> solutions = new ArrayList<>();
            
            // Placeholder data - replace with actual database queries
            // Example: Barcelona (club) × Bayern (club)
            if ("club".equals(request.getRowCategoryId()) && "Barcelona".equals(request.getRowCategoryName()) && 
                "club".equals(request.getColCategoryId()) && "Bayern".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("1", "Thiago Alcântara", "Played for both Barcelona and Bayern Munich", null),
                    new PlayerSolution("2", "Arturo Vidal", "Chilean midfielder who played for both clubs", null),
                    new PlayerSolution("3", "Philippe Coutinho", "Brazilian who played for both clubs", null)
                ));
            } 
            // Example: Brazil (country) × World Cup (trophy)
            else if ("country".equals(request.getRowCategoryId()) && "Brazil".equals(request.getRowCategoryName()) && 
                     "trophy".equals(request.getColCategoryId()) && "World Cup".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("4", "Pelé", "Won three World Cups with Brazil", null),
                    new PlayerSolution("5", "Ronaldo", "Brazilian striker who won the World Cup in 2002", null),
                    new PlayerSolution("6", "Cafu", "Brazilian defender who won two World Cups", null)
                ));
            }
            // Example: Man Utd (club) × Real Madrid (club)
            else if ("club".equals(request.getRowCategoryId()) && "Man Utd".equals(request.getRowCategoryName()) && 
                     "club".equals(request.getColCategoryId()) && "Real Madrid".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("7", "Cristiano Ronaldo", "Played for both Manchester United and Real Madrid", null),
                    new PlayerSolution("8", "David Beckham", "English midfielder who played for both clubs", null),
                    new PlayerSolution("9", "Ruud van Nistelrooy", "Dutch striker who played for both clubs", null)
                ));
            }
            // Add more combinations as needed
            
            CellSolutionsResponse response = new CellSolutionsResponse(
                solutions, 
                solutions.size(), 
                "Retrieved " + solutions.size() + " solutions"
            );
            
            System.out.println("Retrieved " + solutions.size() + " solutions for " + 
                               request.getRowCategoryId() + ":" + request.getRowCategoryName() + " × " + 
                               request.getColCategoryId() + ":" + request.getColCategoryName());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error getting cell solutions: " + e.getMessage());
            CellSolutionsResponse errorResponse = new CellSolutionsResponse(
                new ArrayList<>(), 
                0, 
                "Failed to get cell solutions: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    // Request form for validate-answer
    public static class ValidateAnswerRequest {
        private String rowCategoryId;
        private String rowCategoryName;
        private String colCategoryId;
        private String colCategoryName;
        private String playerName;

        // Constructors
        public ValidateAnswerRequest() {}

        public ValidateAnswerRequest(String rowCategoryId, String rowCategoryName, 
                                   String colCategoryId, String colCategoryName, String playerName) {
            this.rowCategoryId = rowCategoryId;
            this.rowCategoryName = rowCategoryName;
            this.colCategoryId = colCategoryId;
            this.colCategoryName = colCategoryName;
            this.playerName = playerName;
        }

        // Getters and setters
        public String getRowCategoryId() { return rowCategoryId; }
        public void setRowCategoryId(String rowCategoryId) { this.rowCategoryId = rowCategoryId; }

        public String getRowCategoryName() { return rowCategoryName; }
        public void setRowCategoryName(String rowCategoryName) { this.rowCategoryName = rowCategoryName; }

        public String getColCategoryId() { return colCategoryId; }
        public void setColCategoryId(String colCategoryId) { this.colCategoryId = colCategoryId; }

        public String getColCategoryName() { return colCategoryName; }
        public void setColCategoryName(String colCategoryName) { this.colCategoryName = colCategoryName; }

        public String getPlayerName() { return playerName; }
        public void setPlayerName(String playerName) { this.playerName = playerName; }
    }

    // Response form for validate-answer - SIMPLIFIED
    public static class ValidateAnswerResponse {
        private boolean correct;

        // Constructors
        public ValidateAnswerResponse() {}

        public ValidateAnswerResponse(boolean correct) {
            this.correct = correct;
        }

        // Getters and setters
        public boolean isCorrect() { return correct; }
        public void setCorrect(boolean correct) { this.correct = correct; }
    }

    @PostMapping("/validate-answer")
    public ResponseEntity<ValidateAnswerResponse> validateAnswer(@RequestBody ValidateAnswerRequest request) {
        try {
            System.out.println("Validating answer '" + request.getPlayerName() + "' for " + 
                               request.getRowCategoryName() + " × " + request.getColCategoryName());
            
            // Get all solutions for this cell (same logic as getCellSolutions)
            List<PlayerSolution> solutions = new ArrayList<>();
            
            if ("club".equals(request.getRowCategoryId()) && "Barcelona".equals(request.getRowCategoryName()) && 
                "club".equals(request.getColCategoryId()) && "Bayern".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("1", "Thiago Alcântara", "Played for both Barcelona and Bayern Munich", null),
                    new PlayerSolution("2", "Arturo Vidal", "Chilean midfielder who played for both clubs", null),
                    new PlayerSolution("3", "Philippe Coutinho", "Brazilian who played for both clubs", null)
                ));
            } 
            else if ("country".equals(request.getRowCategoryId()) && "Brazil".equals(request.getRowCategoryName()) && 
                     "trophy".equals(request.getColCategoryId()) && "World Cup".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("4", "Pelé", "Won three World Cups with Brazil", null),
                    new PlayerSolution("5", "Ronaldo", "Brazilian striker who won the World Cup in 2002", null),
                    new PlayerSolution("6", "Cafu", "Brazilian defender who won two World Cups", null)
                ));
            }
            else if ("club".equals(request.getRowCategoryId()) && "Man Utd".equals(request.getRowCategoryName()) && 
                     "club".equals(request.getColCategoryId()) && "Real Madrid".equals(request.getColCategoryName())) {
                solutions.addAll(Arrays.asList(
                    new PlayerSolution("7", "Cristiano Ronaldo", "Played for both Manchester United and Real Madrid", null),
                    new PlayerSolution("8", "David Beckham", "English midfielder who played for both clubs", null),
                    new PlayerSolution("9", "Ruud van Nistelrooy", "Dutch striker who played for both clubs", null)
                ));
            }
            
            // Check if playerName matches any solution (case-insensitive)
            boolean isCorrect = solutions.stream()
                .anyMatch(solution -> 
                    solution.getName().equalsIgnoreCase(request.getPlayerName().trim()));
        
            ValidateAnswerResponse response = new ValidateAnswerResponse(isCorrect);
        
            System.out.println("Validated answer '" + request.getPlayerName() + "': " + isCorrect);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error validating answer: " + e.getMessage());
            ValidateAnswerResponse errorResponse = new ValidateAnswerResponse(false);
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/game-session")
    public ResponseEntity<?> createGameSession(@RequestParam String gameMode) {
        try {
            // Create a new game session
            String sessionId = UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("gameMode", gameMode);
            response.put("currentPlayer", "X");
            response.put("status", "active");
            response.put("createdAt", new Date().toString());
            
            System.out.println("Created new tic-tac-toe game session: " + sessionId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating game session: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Failed to create game session"));
        }
    }
}
