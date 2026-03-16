package tracker.adventure.backend.github.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tracker.adventure.backend.github.model.GitHubIssue;

@Repository
public interface GitHubIssueRepository extends JpaRepository<GitHubIssue, String> {
    Optional<GitHubIssue> findByGithubId(Long githubId);

    List<GitHubIssue> findByRepoFullName(String repoFullName);
}