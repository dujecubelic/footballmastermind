package football_mastermind.opp.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import football_mastermind.opp.chatgpt.ChatRequest;
import football_mastermind.opp.chatgpt.ChatResponse;
import football_mastermind.opp.chatgpt.Message;
import football_mastermind.opp.chatgpt.TriviaQuestion;
import football_mastermind.opp.service.ChatGptService;
import football_mastermind.opp.service.SerpApiSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.text.Normalizer;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class ChatGptServiceImpl implements ChatGptService {

    @Autowired
    private SerpApiSearchService serpApiSearchService;

    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";
    private static final String API_KEY = System.getenv("openApiKey");
    private final WebClient webClient;

    public ChatGptServiceImpl(WebClient.Builder builder) {
        this.webClient = builder.baseUrl(OPENAI_URL).build();
    }

    @Override
    public List<TriviaQuestion> generateQuestions(String category, String difficulty) {
        String systemPrompt = "You are a football trivia expert.";
        String userPrompt = String.format("""
        Generate 15 football trivia questions in JSON format for category "%s" and difficulty "%s".
        Use the following format:
        [
          {
            "question": "...",
            "correctAnswer": "..."
          }
          // ... 14 more
        ]
        Do not include explanation or any other text.
    """, category, difficulty);

        ChatRequest chatRequest = new ChatRequest(List.of(
                new Message("system", systemPrompt),
                new Message("user", userPrompt)
        ));

        ChatResponse response = webClient.post()
                .uri("https://api.openai.com/v1/chat/completions")
                .header("Authorization", "Bearer " + API_KEY)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(chatRequest)
                .retrieve()
                .bodyToMono(ChatResponse.class)
                .block();

        if (response == null || response.getFirstMessage() == null) {
            throw new RuntimeException("Empty response from ChatGPT");
        }

        String content = response.getFirstMessage().getContent().trim();
        System.out.println("ChatGPT returned:\n" + content);

        if (content.startsWith("```")) {
            int start = content.indexOf("[");
            int end = content.lastIndexOf("]");
            if (start >= 0 && end >= 0) {
                content = content.substring(start, end + 1);
            } else {
                throw new RuntimeException("ChatGPT response doesn't contain valid JSON array");
            }
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String, String>> rawQuestions = mapper.readValue(content, new TypeReference<>() {});

            List<TriviaQuestion> validatedQuestions = new java.util.ArrayList<>(rawQuestions.stream()
                    .map(q -> {
                        String question = q.getOrDefault("question", "Unknown question");
                        String answer = q.getOrDefault("correctAnswer", "Unknown answer");

                        boolean isValid = serpApiSearchService.validateAnswer(question, answer);
                        if (!isValid) {
                            System.out.printf("Replacing incorrect answer for: %s%n", question);
                            String replacement = serpApiSearchService.findLikelyAnswer(question);
                            if (replacement != null && !replacement.isBlank()) {
                                answer = replacement;
                            }
                        }

                        return new TriviaQuestion(question, answer, category, difficulty);
                    })
                    .toList());

            Collections.shuffle(validatedQuestions);
            return validatedQuestions.stream().limit(10).toList();

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse ChatGPT trivia questions: " + content, e);
        }
    }

    private String normalize(String input) {
        return Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^a-zA-Z0-9 ]", "")
                .toLowerCase()
                .trim();
    }
}
