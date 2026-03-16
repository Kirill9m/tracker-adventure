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

    public Flux<String> reviewCode(String code, String language) {
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
                "stream", true,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)));

        return webClient.post()
                .uri(baseUrl + "/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(String.class)
                .filter(chunk -> !chunk.equals("[DONE]"))
                .mapNotNull(chunk -> {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode node = mapper.readTree(chunk);
                        JsonNode content = node
                                .path("choices")
                                .path(0)
                                .path("delta")
                                .path("content");
                        if (content.isMissingNode() || content.isNull())
                            return null;
                        String text = content.asText();
                        return text.isEmpty() ? null : text;
                    } catch (Exception e) {
                        return null;
                    }
                });
    }
}