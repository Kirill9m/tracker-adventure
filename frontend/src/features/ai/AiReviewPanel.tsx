import { useState, useRef } from "react";

export default function AiReviewPanel() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleReview = async () => {
    if (!code.trim()) return;
    setReview("");
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
        signal: abortRef.current.signal,
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const text = line.replace("data:", "");
            setReview((prev) => prev + text);
          }
        }
      }
    } catch (e) {
      // aborted
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-3">
        <h2 className="text-white font-semibold">AI Code Review</h2>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-1.5 border border-gray-700 outline-none"
        >
          <option value="java">Java</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="kotlin">Kotlin</option>
          <option value="sql">SQL</option>
        </select>
      </div>

      <div className="flex gap-4 flex-1">
        {/* Code input */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-gray-400 text-xs">Paste your code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// paste code here..."
            className="flex-1 bg-gray-800 text-gray-200 text-sm font-mono rounded-lg p-4 border border-gray-700 focus:border-blue-500 outline-none resize-none min-h-64"
          />
          <div className="flex gap-2">
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? "Reviewing..." : "Review code"}
            </button>
            {loading && (
              <button
                onClick={handleStop}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>

        {/* Review output */}
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-gray-400 text-xs">Review</label>
          <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700 text-gray-200 text-sm overflow-auto whitespace-pre-wrap min-h-64">
            {review || (
              <span className="text-gray-600">Review will appear here...</span>
            )}
            {loading && <span className="animate-pulse">▋</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
