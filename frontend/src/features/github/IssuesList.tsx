
import { useIssues, type GitHubIssue } from '../../api/github'

interface Props {
  repoFullName: string
}

function IssueCard({ issue }: { issue: GitHubIssue }) {
  return (
    <a
      href={issue.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500 text-xs">#{issue.issueNumber}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              issue.state === 'open'
                ? 'bg-green-900 text-green-300'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {issue.state}
            </span>
          </div>
          <p className="text-white text-sm font-medium">{issue.title}</p>
          {issue.body && (
            <p className="text-gray-400 text-xs mt-1 line-clamp-2">{issue.body}</p>
          )}u
        </div>
      </div>
    </a>
  )
}

export default function IssuesList({ repoFullName }: Props) {
  const { data: issues = [], isLoading } = useIssues(repoFullName)

  if (isLoading) return (
    <div className="text-gray-500 text-sm">Loading issues...</div>
  )

  if (issues.length === 0) return (
    <div className="text-gray-600 text-sm">No issues yet — create one on GitHub!</div>
  )

  return (
    <div className="flex flex-col gap-2">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  )
}