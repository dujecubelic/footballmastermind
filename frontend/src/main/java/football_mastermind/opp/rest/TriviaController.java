package football_mastermind.opp.rest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;

import java.util.*;

@RestController
@RequestMapping("/api/trivia")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TriviaController {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // Request form for generating questions
    public static class GenerateQuestionsRequest {
        private String category;
        private String difficulty;

        public GenerateQuestionsRequest() {}

        public GenerateQuestionsRequest(String category, String difficulty) {
            this.category = category;
            this.difficulty = difficulty;
        }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    }

    // Question model
    public static class TriviaQuestion {
        private String id;
        private String question;
        private String correctAnswer;
        private String category;
        private String difficulty;

        public TriviaQuestion() {}

        public TriviaQuestion(String id, String question, String correctAnswer, String category, String difficulty) {
            this.id = id;
            this.question = question;
            this.correctAnswer = correctAnswer;
            this.category = category;
            this.difficulty = difficulty;
        }

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }

        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    }

    // Response form for generated questions
    public static class GenerateQuestionsResponse {
        private List<TriviaQuestion> questions;
        private String category;
        private String difficulty;
        private String sessionId;

        public GenerateQuestionsResponse() {}

        public GenerateQuestionsResponse(List<TriviaQuestion> questions, String category, String difficulty, String sessionId) {
            this.questions = questions;
            this.category = category;
            this.difficulty = difficulty;
            this.sessionId = sessionId;
        }

        public List<TriviaQuestion> getQuestions() { return questions; }
        public void setQuestions(List<TriviaQuestion> questions) { this.questions = questions; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getDifficulty() { return difficulty; }
        public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

        public String getSessionId() { return sessionId; }
        public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<GenerateQuestionsResponse> generateQuestions(@RequestBody GenerateQuestionsRequest request) {
        try {
            System.out.println("Generating questions for category: " + request.getCategory() + ", difficulty: " + request.getDifficulty());

            List<TriviaQuestion> questions;

            if (openaiApiKey != null && !openaiApiKey.isEmpty()) {
                // Use ChatGPT to generate questions
                questions = generateQuestionsWithChatGPT(request.getCategory(), request.getDifficulty());
            } else {
                // Fallback to hardcoded questions
                System.out.println("OpenAI API key not configured, using fallback questions");
                questions = generateFallbackQuestions(request.getCategory(), request.getDifficulty());
            }

            String sessionId = UUID.randomUUID().toString();

            GenerateQuestionsResponse response = new GenerateQuestionsResponse(
                questions,
                request.getCategory(),
                request.getDifficulty(),
                sessionId
            );

            System.out.println("Generated " + questions.size() + " questions for " + request.getCategory());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error generating questions: " + e.getMessage());
            e.printStackTrace();
            
            // Return fallback questions on error
            List<TriviaQuestion> fallbackQuestions = generateFallbackQuestions(request.getCategory(), request.getDifficulty());
            GenerateQuestionsResponse response = new GenerateQuestionsResponse(
                fallbackQuestions,
                request.getCategory(),
                request.getDifficulty(),
                UUID.randomUUID().toString()
            );
            
            return ResponseEntity.ok(response);
        }
    }

    private List<TriviaQuestion> generateQuestionsWithChatGPT(String category, String difficulty) {
        try {
            String prompt = buildPrompt(category, difficulty);
            
            // OpenAI API request
            String url = "https://api.openai.com/v1/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini");
            requestBody.put("max_tokens", 2000);
            requestBody.put("temperature", 0.7);
            
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "user", "content", prompt));
            requestBody.put("messages", messages);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class).getBody();
            
            if (response != null && response.containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) message.get("content");
                    
                    return parseQuestionsFromChatGPT(content, category, difficulty);
                }
            }
            
            throw new RuntimeException("Invalid response from OpenAI API");
            
        } catch (Exception e) {
            System.err.println("Error calling ChatGPT API: " + e.getMessage());
            throw e;
        }
    }

    private String buildPrompt(String category, String difficulty) {
        return String.format(
            "Generate exactly 10 football trivia questions about '%s' with '%s' difficulty. " +
            "Format each question as: Q: [question] A: [answer]. " +
            "Make sure answers are short and specific (player names, years, team names, etc.). " +
            "Separate each question with a new line. " +
            "Example format:\n" +
            "Q: Who won the 2018 World Cup? A: France\n" +
            "Q: Which player scored the most goals in Premier League history? A: Alan Shearer",
            category, difficulty
        );
    }

    private List<TriviaQuestion> parseQuestionsFromChatGPT(String content, String category, String difficulty) {
        List<TriviaQuestion> questions = new ArrayList<>();
        String[] lines = content.split("\n");
        
        String currentQuestion = null;
        String currentAnswer = null;
        
        for (String line : lines) {
            line = line.trim();
            if (line.startsWith("Q:")) {
                currentQuestion = line.substring(2).trim();
            } else if (line.startsWith("A:") && currentQuestion != null) {
                currentAnswer = line.substring(2).trim();
                
                questions.add(new TriviaQuestion(
                    UUID.randomUUID().toString(),
                    currentQuestion,
                    currentAnswer,
                    category,
                    difficulty
                ));
                
                currentQuestion = null;
                currentAnswer = null;
            }
        }
        
        // If we don't have exactly 10 questions, pad with fallback questions
        while (questions.size() < 10) {
            List<TriviaQuestion> fallback = generateFallbackQuestions(category, difficulty);
            for (TriviaQuestion q : fallback) {
                if (questions.size() < 10) {
                    questions.add(q);
                }
            }
        }
        
        return questions.subList(0, 10); // Ensure exactly 10 questions
    }

    private List<TriviaQuestion> generateFallbackQuestions(String category, String difficulty) {
        List<TriviaQuestion> questions = new ArrayList<>();
        
        // Fallback questions based on category
        if (category.toLowerCase().contains("premier league")) {
            questions.addAll(Arrays.asList(
                new TriviaQuestion("1", "Which team has won the most Premier League titles?", "Manchester United", category, difficulty),
                new TriviaQuestion("2", "Who is the Premier League's all-time top scorer?", "Alan Shearer", category, difficulty),
                new TriviaQuestion("3", "In which year did the Premier League start?", "1992", category, difficulty),
                new TriviaQuestion("4", "Which player has the most Premier League assists?", "Ryan Giggs", category, difficulty),
                new TriviaQuestion("5", "Which team went unbeaten in the 2003-04 Premier League season?", "Arsenal", category, difficulty)
            ));
        } else if (category.toLowerCase().contains("champions league")) {
            questions.addAll(Arrays.asList(
                new TriviaQuestion("1", "Which team has won the most Champions League titles?", "Real Madrid", category, difficulty),
                new TriviaQuestion("2", "Who is the Champions League's all-time top scorer?", "Cristiano Ronaldo", category, difficulty),
                new TriviaQuestion("3", "In which year was the Champions League format introduced?", "1992", category, difficulty),
                new TriviaQuestion("4", "Which stadium hosted the 2019 Champions League final?", "Wanda Metropolitano", category, difficulty),
                new TriviaQuestion("5", "Which English team won the Champions League in 2005?", "Liverpool", category, difficulty)
            ));
        } else if (category.toLowerCase().contains("world cup")) {
            questions.addAll(Arrays.asList(
                new TriviaQuestion("1", "Which country has won the most World Cups?", "Brazil", category, difficulty),
                new TriviaQuestion("2", "Who won the 2018 World Cup?", "France", category, difficulty),
                new TriviaQuestion("3", "In which year was the first World Cup held?", "1930", category, difficulty),
                new TriviaQuestion("4", "Which player has scored the most World Cup goals?", "Miroslav Klose", category, difficulty),
                new TriviaQuestion("5", "Which country hosted the 2014 World Cup?", "Brazil", category, difficulty)
            ));
        } else {
            // Generic football questions
            questions.addAll(Arrays.asList(
                new TriviaQuestion("1", "Which player has won the most Ballon d'Or awards?", "Lionel Messi", category, difficulty),
                new TriviaQuestion("2", "Which country won the first World Cup?", "Uruguay", category, difficulty),
                new TriviaQuestion("3", "How many players are on a football team on the field?", "11", category, difficulty),
                new TriviaQuestion("4", "Which club is known as 'The Red Devils'?", "Manchester United", category, difficulty),
                new TriviaQuestion("5", "In which city is the Camp Nou stadium located?", "Barcelona", category, difficulty)
            ));
        }
        
        // Pad with more generic questions if needed
        while (questions.size() < 10) {
            questions.add(new TriviaQuestion(
                UUID.randomUUID().toString(),
                "What is the maximum number of substitutions allowed in a football match?",
                "5",
                category,
                difficulty
            ));
        }
        
        return questions.subList(0, 10);
    }
}
