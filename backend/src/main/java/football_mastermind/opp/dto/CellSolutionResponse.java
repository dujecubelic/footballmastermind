package football_mastermind.opp.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class CellSolutionResponse {
    private String category1;
    private String category2;
    private List<String> players;

    public CellSolutionResponse(String category1, String category2, List<String> players) {
        this.category1 = category1;
        this.category2 = category2;
        this.players = players;
    }

    public CellSolutionResponse() {
        this.category1 = null;
        this.category2 = null;
        this.players = null;
    }

}
