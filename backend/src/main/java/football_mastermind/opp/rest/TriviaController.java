package football_mastermind.opp.rest;

import football_mastermind.opp.chatgpt.TriviaQuestion;
import football_mastermind.opp.chatgpt.TriviaRequest;
import football_mastermind.opp.chatgpt.TriviaResponse;
import football_mastermind.opp.service.ChatGptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trivia")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TriviaController {

    @Autowired
    private final ChatGptService chatGptService;

    public TriviaController(ChatGptService chatGptService) {
        this.chatGptService = chatGptService;
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<TriviaResponse> generate(@RequestBody TriviaRequest request) {
        List<TriviaQuestion> questions = chatGptService.generateQuestions(request.getCategory(), request.getDifficulty());
        return ResponseEntity.ok(new TriviaResponse(questions, request.getCategory(), request.getDifficulty()));
    }
}
