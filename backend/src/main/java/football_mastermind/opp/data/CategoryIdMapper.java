package football_mastermind.opp.data;

import java.util.HashMap;
import java.util.Map;

public class CategoryIdMapper {
    private static final Map<String, String> CLUB_MAP = new HashMap<>();
    private static final Map<String, String> COUNTRY_MAP = new HashMap<>();

    static {
        CLUB_MAP.put("barcelona", "154774");
        CLUB_MAP.put("bayern", "152008");
        CLUB_MAP.put("man utd", "154064");
        CLUB_MAP.put("real madrid", "159928");

        COUNTRY_MAP.put("brazil", "BRA");
        COUNTRY_MAP.put("germany", "GER");
        COUNTRY_MAP.put("france", "FRA");
    }

    public static String getId(String type, String name) {
        if (type.equalsIgnoreCase("club")) {
            return CLUB_MAP.getOrDefault(name, "");
        } else if (type.equalsIgnoreCase("country")) {
            return COUNTRY_MAP.getOrDefault(name, "");
        }
        return "";
    }

    public static boolean isCountry(String name) {
        return COUNTRY_MAP.containsKey(name.toLowerCase().trim());
    }

    public static boolean isClub(String name) {
        return CLUB_MAP.containsKey(name.toLowerCase().trim());
    }
}

