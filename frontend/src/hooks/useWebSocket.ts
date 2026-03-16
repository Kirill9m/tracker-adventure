import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface Notification {
  type: string;
  data: unknown;
  boardId: string;
}

export function useWebSocket(
  boardId: string | null,
  onNotification: (notification: Notification) => void,
) {
  const clientRef = useRef<Client | null>(null);
  const onNotificationRef = useRef(onNotification);
  onNotificationRef.current = onNotification;

  useEffect(() => {
    if (!boardId) return;

    const token = localStorage.getItem("token");

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("WS connected");
        client.subscribe(`/topic/board/${boardId}`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            onNotificationRef.current(notification);
          } catch (e) {
            console.error("WS parse error", e);
          }
        });
      },
      onDisconnect: () => console.log("WS disconnected"),
      onStompError: (frame) => console.error("WS error", frame),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [boardId]);
}
