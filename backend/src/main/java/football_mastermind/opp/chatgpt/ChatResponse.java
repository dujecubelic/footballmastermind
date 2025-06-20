package football_mastermind.opp.chatgpt;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ChatResponse {
    private List<Choice> choices;

    public Message getFirstMessage() {
        return choices != null && !choices.isEmpty() ? choices.get(0).message : null;
    }

    public static class Choice {
        private Message message;

        public Message getMessage() {
            return message;
        }

        public void setMessage(Message message) {
            this.message = message;
        }
    }

}
