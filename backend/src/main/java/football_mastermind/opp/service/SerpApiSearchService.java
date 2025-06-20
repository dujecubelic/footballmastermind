package football_mastermind.opp.service;

public interface SerpApiSearchService {
    boolean validateAnswer(String question, String correctAnswer);

    String findLikelyAnswer(String question);
}
