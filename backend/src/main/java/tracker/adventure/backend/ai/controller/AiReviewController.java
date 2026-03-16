package tracker.adventure.backend.ai.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import tracker.adventure.backend.ai.service.AiReviewService;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiReviewController {

    private final AiReviewService aiReviewService;

    @PostMapping(value = "/review", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> review(@RequestBody ReviewRequest request) {
        return aiReviewService.reviewCode(request.code(), request.language());
    }

    record ReviewRequest(String code, String language) {
    }
}