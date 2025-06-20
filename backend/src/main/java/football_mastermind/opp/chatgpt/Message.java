package football_mastermind.opp.chatgpt;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Message {
    private String role;
    private String content;

    public Message(String role, String content) {
        this.role = role;
        this.content = content;
    }

}
