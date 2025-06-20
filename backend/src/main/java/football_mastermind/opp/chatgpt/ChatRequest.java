package football_mastermind.opp.chatgpt;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class ChatRequest {
    private String model = "gpt-4o";
    private List<Message> messages;

    public ChatRequest(List<Message> messages) {
        this.messages = messages;
    }

}
