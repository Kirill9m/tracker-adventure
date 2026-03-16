import { useQuery } from "@tanstack/react-query";
import api from "../lib/axios";

export interface GitHubIssue {
  id: string;
  githubId: number;
  title: string;
  body: string;
  state: string;
  githubUrl: string;
  repoFullName: string;
  issueNumber: number;
}

export interface IssueStats {
  total: number;
  open: number;
  closed: number;
  byDay: Record<string, number>;
}

export const useIssues = (repoFullName: string) =>
  useQuery({
    queryKey: ["issues", repoFullName],
    queryFn: () =>
      api
        .get<GitHubIssue[]>(`/github/issues?repo=${repoFullName}`)
        .then((r) => r.data),
    enabled: !!repoFullName,
  });

export const useIssueStats = (repoFullName: string) =>
  useQuery({
    queryKey: ["issue-stats", repoFullName],
    queryFn: () =>
      api
        .get<IssueStats>(`/github/issues/stats?repo=${repoFullName}`)
        .then((r) => r.data),
    enabled: !!repoFullName,
  });
