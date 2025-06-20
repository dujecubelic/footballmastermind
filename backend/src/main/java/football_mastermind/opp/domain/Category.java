package football_mastermind.opp.domain;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Category {
    private String id;
    private String name;

    public Category(String id, String name) {
        this.id = id;
        this.name = name;
    }

}
