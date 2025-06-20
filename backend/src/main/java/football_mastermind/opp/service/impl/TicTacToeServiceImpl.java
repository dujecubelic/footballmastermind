package football_mastermind.opp.service.impl;

import football_mastermind.opp.data.Categories;
import football_mastermind.opp.data.CategoryIdMapper;
import football_mastermind.opp.dto.CellSolutionResponse;
import football_mastermind.opp.domain.Category;
import football_mastermind.opp.dto.ValidateAnswerResponse;
import football_mastermind.opp.service.TicTacToeService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TicTacToeServiceImpl implements TicTacToeService {

    private final Random random = new Random();

    List<Category> pickRandomUnique(List<Category> source, int count, Set<String> excludeNames) {
        List<Category> filtered = source.stream()
                .filter(c -> !excludeNames.contains(c.getName()))
                .collect(Collectors.toList());
        Collections.shuffle(filtered);
        return filtered.stream().limit(count).collect(Collectors.toList());
    }

    @Override
    public Map<String, List<Category>> getRandomCategories() {
        int size = 3;

        List<Category> clubs = new ArrayList<>(Categories.CLUBS);
        List<Category> countries = new ArrayList<>(Categories.COUNTRIES);
        // List<Category> trophies = new ArrayList<>(Categories.TROPHIES); // For future use

        Collections.shuffle(clubs);
        Collections.shuffle(countries);
        // Collections.shuffle(trophies);

        List<Category> rowCategories = new ArrayList<>();
        List<Category> colCategories = new ArrayList<>();
        Set<String> usedNames = new HashSet<>();

        List<String> countryPositionOptions = List.of("row", "col", "none");
        String countryPosition = countryPositionOptions.get(random.nextInt(countryPositionOptions.size()));

        int clubsUsed = 0;

        // --- Fill rows ---
        if ("row".equals(countryPosition)) {
            Category country = countries.remove(0);
            rowCategories.add(country);
            usedNames.add(country.getName());

            while (rowCategories.size() < size) {
                Category next = getUnique(clubs, usedNames);
                if (next != null) {
                    rowCategories.add(next);
                    usedNames.add(next.getName());
                    if ("club".equals(next.getId())) clubsUsed++;
                }
                // else try trophy fallback (disabled)
                // else {
                //     next = getUnique(trophies, usedNames);
                //     if (next != null) {
                //         rowCategories.add(next);
                //         usedNames.add(next.getName());
                //     }
                // }
            }
        } else {
            while (rowCategories.size() < size) {
                Category next = getUnique(clubs, usedNames);
                if (next != null) {
                    rowCategories.add(next);
                    usedNames.add(next.getName());
                    if ("club".equals(next.getId())) clubsUsed++;
                }
                // else {
                //     next = getUnique(trophies, usedNames);
                //     if (next != null) {
                //         rowCategories.add(next);
                //         usedNames.add(next.getName());
                //     }
                // }
            }
        }

        // --- Fill columns ---
        if ("col".equals(countryPosition)) {
            Category country = countries.remove(0);
            colCategories.add(country);
            usedNames.add(country.getName());

            while (colCategories.size() < size) {
                Category next = getUnique(clubs, usedNames);
                if (next != null) {
                    colCategories.add(next);
                    usedNames.add(next.getName());
                    if ("club".equals(next.getId())) clubsUsed++;
                }
                // else {
                //     next = getUnique(trophies, usedNames);
                //     if (next != null) {
                //         colCategories.add(next);
                //         usedNames.add(next.getName());
                //     }
                // }
            }
        } else {
            while (colCategories.size() < size) {
                Category next = getUnique(clubs, usedNames);
                if (next != null) {
                    colCategories.add(next);
                    usedNames.add(next.getName());
                    if ("club".equals(next.getId())) clubsUsed++;
                }
                // else {
                //     next = getUnique(trophies, usedNames);
                //     if (next != null) {
                //         colCategories.add(next);
                //         usedNames.add(next.getName());
                //     }
                // }
            }
        }

        // --- Ensure at least 3 club categories ---
        while (clubsUsed < 3) {
            Optional<Category> clubReplacement = clubs.stream()
                    .filter(c -> !usedNames.contains(c.getName()))
                    .findFirst();

            if (clubReplacement.isEmpty()) break;

            Category newClub = clubReplacement.get();
            boolean replaced = false;

            for (int i = 0; i < rowCategories.size(); i++) {
                if (!"club".equals(rowCategories.get(i).getId())) {
                    usedNames.remove(rowCategories.get(i).getName());
                    rowCategories.set(i, newClub);
                    usedNames.add(newClub.getName());
                    clubsUsed++;
                    replaced = true;
                    break;
                }
            }

            if (!replaced) {
                for (int i = 0; i < colCategories.size(); i++) {
                    if (!"club".equals(colCategories.get(i).getId())) {
                        usedNames.remove(colCategories.get(i).getName());
                        colCategories.set(i, newClub);
                        usedNames.add(newClub.getName());
                        clubsUsed++;
                        break;
                    }
                }
            }

            clubs.remove(newClub);
        }

        Map<String, List<Category>> result = new HashMap<>();
        result.put("rowCategories", rowCategories);
        result.put("colCategories", colCategories);

        return result;
    }

    private static final String BASE = "https://fbref.com/en/friv/players-who-played-for-multiple-clubs-countries.fcgi";

    private String buildFbrefUrl(String param1, String param2) {
        return "https://fbref.com/en/friv/players-who-played-for-multiple-clubs-countries.fcgi"
                + "?level=franch&t1=" + param1 + "&t2=" + param2 + "&t3=--&t4=--";
    }

    @Cacheable(value = "cellSolutions", key = "#cat1.toLowerCase().trim() + '-' + #cat2.toLowerCase().trim()")
    @Override
    public CellSolutionResponse getSolutions(String cat1, String cat2) throws IOException {
        String param1 = identifyParam(cat1);
        String param2 = identifyParam(cat2);

        String url = buildFbrefUrl(param1, param2);

        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
                .referrer("https://www.google.com")
                .header("Accept-Language", "en-US,en;q=0.9")
                .timeout(10 * 1000)
                .get();

        Element table = doc.selectFirst("table#multifranchise_stats_1");

        if (table == null) {
            return new CellSolutionResponse(cat1, cat2, List.of());
        }

        Elements rows = table.select("tbody tr");
        List<String> players = rows.stream()
                .map(row -> {
                    Element playerCell = row.selectFirst("th[data-stat=player] a");
                    return playerCell != null ? playerCell.text() : null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return new CellSolutionResponse(cat1, cat2, players);
    }

    @Override
    public ValidateAnswerResponse validateAnswer(String cat1, String cat2, String playerName) throws Exception {
        CellSolutionResponse cell = getSolutions(cat1, cat2);

        boolean match = cell.getPlayers().stream()
                .anyMatch(name -> name.equalsIgnoreCase(playerName.trim()));

        return new ValidateAnswerResponse(match);
    }

    private String identifyParam(String categoryName) {
        String name = categoryName.trim().toLowerCase();

        if (CategoryIdMapper.isCountry(name)) {
            return "NAT_" + CategoryIdMapper.getId("country", name);
        } else if (CategoryIdMapper.isClub(name)) {
            return CategoryIdMapper.getId("club", name);
        }

        throw new IllegalArgumentException("Unknown category: " + categoryName);
    }

    private Category getUnique(List<Category> source, Set<String> used) {
        for (Category c : source) {
            if (!used.contains(c.getName())) {
                source.remove(c);
                return c;
            }
        }
        return null;
    }
}
