package football_mastermind.opp.chatgpt;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
public class TriviaQuestion {
    private String id;
    private String question;
    private String correctAnswer;
    private String category;
    private String difficulty;

    public TriviaQuestion(String question, String correctAnswer, String category, String difficulty) {
        this.id = UUID.randomUUID().toString();
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.category = category;
        this.difficulty = difficulty;
    }

}
