package football_mastermind.opp.service;

import football_mastermind.opp.chatgpt.TriviaQuestion;

import java.util.List;

public interface ChatGptService {
    public List<TriviaQuestion> generateQuestions(String category, String difficulty);
}
