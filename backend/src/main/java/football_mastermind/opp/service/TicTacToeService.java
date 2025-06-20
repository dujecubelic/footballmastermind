package football_mastermind.opp.service;

import football_mastermind.opp.dto.CellSolutionResponse;
import football_mastermind.opp.domain.Category;
import football_mastermind.opp.dto.ValidateAnswerResponse;

import java.util.List;
import java.util.Map;

public interface TicTacToeService {

    Map<String, List<Category>> getRandomCategories();
    CellSolutionResponse getSolutions(String cat1, String cat2) throws Exception;
    ValidateAnswerResponse validateAnswer(String cat1Name, String cat2Name, String playerName) throws Exception;

}
