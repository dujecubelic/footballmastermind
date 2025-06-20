package football_mastermind.opp.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ValidateAnswerRequest {
    private String rowCategoryId;
    private String rowCategoryName;
    private String colCategoryId;
    private String colCategoryName;
    private String playerName;

}
