import { useState } from "react";
import { useIssueStats } from "../../api/github";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#22c55e", "#6b7280"];

interface Props {
  defaultRepo?: string;
}

export default function AnalyticsDashboard({ defaultRepo = "" }: Props) {
  const [repo, setRepo] = useState(defaultRepo);
  const [inputRepo, setInputRepo] = useState(defaultRepo);
  const { data: stats, isLoading } = useIssueStats(repo);

  const pieData = stats
    ? [
        { name: "Open", value: stats.open },
        { name: "Closed", value: stats.closed },
      ]
    : [];

  const barData = stats
    ? Object.entries(stats.byDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: date.slice(5), count }))
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Repo input */}
      <div className="flex items-center gap-3">
        <input
          value={inputRepo}
          onChange={(e) => setInputRepo(e.target.value)}
          placeholder="owner/repo"
          className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 outline-none w-64"
        />
        <button
          onClick={() => setRepo(inputRepo)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          Load
        </button>
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      {stats && (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Total issues</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Open</p>
              <p className="text-green-400 text-2xl font-bold">{stats.open}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-xs mb-1">Closed</p>
              <p className="text-gray-400 text-2xl font-bold">{stats.closed}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Bar chart */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-300 text-sm font-medium mb-4">
                Issues by day
              </p>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-600 text-sm">No data yet</p>
              )}
            </div>

            {/* Pie chart */}
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-300 text-sm font-medium mb-4">
                Open vs Closed
              </p>
              {stats.total > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>
                          {value}
                        </span>
                      )}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: 8,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-600 text-sm">No data yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
