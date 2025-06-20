package football_mastermind.opp.service.impl;

import football_mastermind.opp.service.impl.SerpApiSearchServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TriviaValidationServiceImpl {

    private final SerpApiSearchServiceImpl serpApiSearchService;

    public TriviaValidationServiceImpl(SerpApiSearchServiceImpl serpApiSearchService) {
        this.serpApiSearchService = serpApiSearchService;
    }

    public boolean validateAnswer(String question, String expectedAnswer) {
        List<String> snippets = serpApiSearchService.searchSnippets(question);

        return snippets.stream().anyMatch(s -> s.toLowerCase().contains(expectedAnswer.toLowerCase()));
    }
}
