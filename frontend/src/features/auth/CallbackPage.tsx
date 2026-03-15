import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function CallbackPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    console.log("Full URL:", window.location.href);
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Token:", token);

    if (token) {
      setToken(token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Signing in...</p>
    </div>
  );
}
