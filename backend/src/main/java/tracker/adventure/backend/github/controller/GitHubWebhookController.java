package tracker.adventure.backend.github.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.github.model.GitHubIssue;
import tracker.adventure.backend.github.service.GitHubWebhookService;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubWebhookController {

    private final GitHubWebhookService webhookService;

    @PostMapping("/webhook")
    public ResponseEntity<Void> webhook(
            @RequestHeader(value = "X-GitHub-Event", required = false) String event,
            @RequestBody Map<String, Object> payload) {

        System.out.println("GitHub event received: " + event);

        if ("issues".equals(event)) {
            webhookService.handleIssueEvent(payload);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping("/issues")
    public ResponseEntity<List<GitHubIssue>> getIssues(@RequestParam String repo) {
        return ResponseEntity.ok(webhookService.getIssues(repo));
    }
}