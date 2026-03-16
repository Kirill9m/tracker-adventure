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

export const useIssues = (repoFullName: string) =>
  useQuery({
    queryKey: ["issues", repoFullName],
    queryFn: () =>
      api
        .get<GitHubIssue[]>(`/github/issues?repo=${repoFullName}`)
        .then((r) => r.data),
    enabled: !!repoFullName,
  });
