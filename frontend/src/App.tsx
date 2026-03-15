import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./features/auth/LoginPage";
import CallbackPage from "./features/auth/CallbackPage";
import api from "./lib/axios";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">DevFlow</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <img src={user.avatarUrl} className="w-8 h-8 rounded-full" />
                <span className="text-gray-300">{user.name}</span>
              </>
            )}
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="text-gray-400">Boards coming soon...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
