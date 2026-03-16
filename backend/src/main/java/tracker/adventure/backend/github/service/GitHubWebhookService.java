package tracker.adventure.backend.github.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.github.model.GitHubIssue;
import tracker.adventure.backend.github.model.repository.GitHubIssueRepository;

@Service
@RequiredArgsConstructor
public class GitHubWebhookService {

    private final GitHubIssueRepository issueRepository;

    public void handleIssueEvent(Map<String, Object> payload) {
        String action = (String) payload.get("action");
        Map<String, Object> issue = (Map<String, Object>) payload.get("issue");
        Map<String, Object> repo = (Map<String, Object>) payload.get("repository");

        if (issue == null || repo == null)
            return;

        Long githubId = ((Number) issue.get("id")).longValue();
        String title = (String) issue.get("title");
        String body = (String) issue.get("body");
        String state = (String) issue.get("state");
        String htmlUrl = (String) issue.get("html_url");
        Integer number = (Integer) issue.get("number");
        String repoFullName = (String) repo.get("full_name");

        switch (action) {
            case "opened", "reopened" -> createOrUpdateIssue(
                    githubId, title, body, state, htmlUrl, number, repoFullName);
            case "edited" -> createOrUpdateIssue(
                    githubId, title, body, state, htmlUrl, number, repoFullName);
            case "closed" -> closeIssue(githubId);
        }
    }

    private void createOrUpdateIssue(Long githubId, String title, String body,
            String state, String htmlUrl,
            Integer number, String repoFullName) {
        GitHubIssue issue = issueRepository.findByGithubId(githubId)
                .orElse(new GitHubIssue());

        issue.setGithubId(githubId);
        issue.setTitle(title);
        issue.setBody(body);
        issue.setState(state);
        issue.setGithubUrl(htmlUrl);
        issue.setIssueNumber(number);
        issue.setRepoFullName(repoFullName);

        issueRepository.save(issue);
        System.out.println("Issue saved: #" + number + " " + title);
    }

    private void closeIssue(Long githubId) {
        issueRepository.findByGithubId(githubId).ifPresent(issue -> {
            issue.setState("closed");
            issueRepository.save(issue);
            System.out.println("Issue closed: #" + issue.getIssueNumber());
        });
    }

    public List<GitHubIssue> getIssues(String repoFullName) {
        return issueRepository.findByRepoFullName(repoFullName);
    }
}