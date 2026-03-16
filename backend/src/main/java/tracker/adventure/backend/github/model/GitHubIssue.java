package tracker.adventure.backend.github.model;

import java.time.LocalDateTime;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import tracker.adventure.backend.task.model.Task;

@Entity
@Table(name = "github_issues")
@Getter
@Setter
@NoArgsConstructor
public class GitHubIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "github_id", unique = true, nullable = false)
    private Long githubId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private String state;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "repo_full_name")
    private String repoFullName;

    @Column(name = "issue_number")
    private Integer issueNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task linkedTask;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}