import { useRef, useState } from "react";

interface Toast {
  id: number;
  type: string;
  message: string;
}

interface Props {
  toasts: Toast[];
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0); // ← useRef вместо let

  const addToast = (type: string, message: string) => {
    const id = ++counterRef.current; // ← уникальный id
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return { toasts, addToast };
}

export default function NotificationToast({ toasts }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-800 border border-gray-700 text-white text-sm px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
        >
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              toast.type === "TASK_CREATED"
                ? "bg-green-400"
                : toast.type === "TASK_MOVED"
                  ? "bg-blue-400"
                  : toast.type === "COLUMN_CREATED"
                    ? "bg-purple-400"
                    : "bg-gray-400"
            }`}
          />
          {toast.message}
        </div>
      ))}
    </div>
  );
}
