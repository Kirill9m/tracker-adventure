package tracker.adventure.backend.ai.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class AiReviewService {

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model}")
    private String model;

    @Value("${openai.base-url}")
    private String baseUrl;

    private final WebClient webClient = WebClient.builder().build();

    public String reviewCode(String code, String language) {
        String prompt = """
                            You are an expert code reviewer. Review the following %s code.
                            Provide feedback on:
                            1. Code quality and best practices
                            2. Potential bugs or issues
                            3. Performance considerations
                            4. Security concerns
                            5. Suggestions for improvement

                            Code to review:
                ```%s
                            %s
                ```
                            """.formatted(language, language, code);

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "stream", false,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)));

        return webClient.post()
                .uri(baseUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(response -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode node = mapper.readTree(response);
                        return node.path("choices").path(0)
                                .path("message").path("content").asText();
                    } catch (Exception e) {
                        return "Error parsing response";
                    }
                })
                .block();
    }
}