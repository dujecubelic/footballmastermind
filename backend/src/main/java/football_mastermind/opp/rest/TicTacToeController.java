package football_mastermind.opp.rest;

import football_mastermind.opp.dto.CellSolutionResponse;
import football_mastermind.opp.domain.Category;
import football_mastermind.opp.dto.ValidateAnswerRequest;
import football_mastermind.opp.dto.ValidateAnswerResponse;
import football_mastermind.opp.service.TicTacToeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tictactoe")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TicTacToeController {

    @Autowired
    private TicTacToeService ticTacToeService;

    @GetMapping("/categories")
    public Map<String, List<Category>> getCategories() {
        return ticTacToeService.getRandomCategories();
    }

    @GetMapping("/cell-solutions")
    public CellSolutionResponse getCellSolutions(
            @RequestParam String cat1,
            @RequestParam String cat2) throws Exception {
        return ticTacToeService.getSolutions(cat1, cat2);
    }

    @PostMapping("/validate-answer")
    public ValidateAnswerResponse validateAnswer(@RequestBody ValidateAnswerRequest request) throws Exception {
        System.out.println("Validating...");
        return ticTacToeService.validateAnswer(
                request.getRowCategoryName(),
                request.getColCategoryName(),
                request.getPlayerName()
        );
    }

}
