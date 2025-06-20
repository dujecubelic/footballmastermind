package football_mastermind.opp.service.impl;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import football_mastermind.opp.service.SerpApiSearchService;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.Normalizer;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.stream.Collectors;

@Service
public class SerpApiSearchServiceImpl implements SerpApiSearchService {

    private static final String API_KEY = "9cb58e8649ec713005c2509578080a933a3814f4";
    private static final String BASE_URL = "https://serpapi.com/search.json";
    private static final ObjectMapper mapper = new ObjectMapper();

    public List<String> searchSnippets(String query) {
        WebClient client = WebClient.create("https://serpapi.com");
        SerpApiResponse response = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search.json")
                        .queryParam("q", query)
                        .queryParam("api_key", API_KEY)
                        .build())
                .retrieve()
                .bodyToMono(SerpApiResponse.class)
                .block();

        return Optional.ofNullable(response)
                .map(r -> r.organic_results)
                .orElse(List.of())
                .stream()
                .map(r -> r.snippet)
                .collect(Collectors.toList());
    }

    @Override
    public boolean validateAnswer(String question, String expectedAnswer) {
        try {
            List<String> snippets = searchSnippets(question);
            String normalizedAnswer = normalize(expectedAnswer);

            return snippets.stream()
                    .map(this::normalize)
                    .anyMatch(snippet -> snippet.contains(normalizedAnswer));
        } catch (Exception e) {
            return true; // fallback to not block generation
        }
    }

    @Override
    public String findLikelyAnswer(String question) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(BASE_URL)
                    .queryParam("q", question)
                    .queryParam("api_key", API_KEY)
                    .queryParam("engine", "google")
                    .toUriString();

            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("GET");

            StringBuilder json = new StringBuilder();
            try (Scanner scanner = new Scanner(connection.getInputStream())) {
                while (scanner.hasNext()) {
                    json.append(scanner.nextLine());
                }
            }

            JsonNode root = mapper.readTree(json.toString());

            // Try featured snippet first
            if (root.has("answer_box")) {
                JsonNode answerBox = root.get("answer_box");

                if (answerBox.has("answer")) {
                    return clean(answerBox.get("answer").asText());
                }
                if (answerBox.has("snippet")) {
                    return clean(answerBox.get("snippet").asText());
                }
                if (answerBox.has("snippet_highlighted_words")) {
                    JsonNode highlights = answerBox.get("snippet_highlighted_words");
                    if (highlights.isArray() && highlights.size() > 0) {
                        return clean(highlights.get(0).asText());
                    }
                }
            }

            // Fallback: extract from first organic result
            if (root.has("organic_results") && root.get("organic_results").isArray()) {
                JsonNode firstResult = root.get("organic_results").get(0);
                if (firstResult.has("snippet")) {
                    return extractLikelyPhrase(firstResult.get("snippet").asText());
                }
            }

        } catch (IOException e) {
            System.err.println("Error fetching from SerpAPI: " + e.getMessage());
        }

        return null;
    }

    private String clean(String raw) {
        return raw.replaceAll("\\[.*?\\]", "").replaceAll("\\s+", " ").trim();
    }

    private String extractLikelyPhrase(String snippet) {
        // Simple heuristic: return the first capitalized phrase before a period or comma
        String[] tokens = snippet.split("[.,]");
        for (String part : tokens) {
            String trimmed = part.trim();
            if (trimmed.matches("([A-Z][a-z]+\\s?)+")) {
                return clean(trimmed);
            }
        }
        return clean(tokens[0]);
    }

    private String normalize(String str) {
        return str.toLowerCase()
                .replaceAll("[^a-z0-9]", "")
                .trim();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class SerpApiResponse {
        public List<Result> organic_results;

        @JsonIgnoreProperties(ignoreUnknown = true)
        static class Result {
            public String snippet;
        }
    }
}
