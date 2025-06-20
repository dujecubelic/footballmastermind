package football_mastermind.opp.chatgpt;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class TriviaResponse {
    private List<TriviaQuestion> questions;
    private String category;
    private String difficulty;
    private String sessionId;

    public TriviaResponse(List<TriviaQuestion> questions, String category, String difficulty) {
        this.questions = questions;
        this.category = category;
        this.difficulty = difficulty;
        this.sessionId = UUID.randomUUID().toString();
    }

}
