package football_mastermind.opp.dto;

public class ValidateAnswerResponse {
    private boolean correct;

    public ValidateAnswerResponse(boolean correct) {
        this.correct = correct;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}
