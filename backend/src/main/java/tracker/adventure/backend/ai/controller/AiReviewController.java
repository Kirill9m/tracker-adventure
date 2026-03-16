package tracker.adventure.backend.ai.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.ai.service.AiReviewService;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiReviewController {

    private final AiReviewService aiReviewService;

    @PostMapping(value = "/review", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> review(@RequestBody ReviewRequest request) {
        String result = aiReviewService.reviewCode(request.code(), request.language());
        return ResponseEntity.ok(Map.of("review", result));
    }

    record ReviewRequest(String code, String language) {
    }
}