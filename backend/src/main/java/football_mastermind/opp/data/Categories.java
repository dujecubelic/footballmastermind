package football_mastermind.opp.data;

import football_mastermind.opp.domain.Category;

import java.util.List;

public class Categories {
    public static final List<Category> CLUBS = List.of(
            new Category("club", "Barcelona"),
            new Category("club", "Man Utd"),
            new Category("club", "Bayern"),
            new Category("club", "Real Madrid"),
            new Category("club", "Juventus"),
            new Category("club", "Liverpool")
    );

    public static final List<Category> COUNTRIES = List.of(
            new Category("country", "Brazil"),
            new Category("country", "Germany"),
            new Category("country", "Argentina"),
            new Category("country", "France"),
            new Category("country", "Spain")
    );

    public static final List<Category> TROPHIES = List.of(
            new Category("trophy", "World Cup"),
            new Category("trophy", "Champions League"),
            new Category("trophy", "Europa League"),
            new Category("trophy", "FA Cup"),
            new Category("trophy", "Copa America")
    );
}
