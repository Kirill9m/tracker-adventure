package tracker.adventure.backend.notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyBoardUpdated(String boardId, String type, Object data) {
        BoardNotification notification = new BoardNotification(type, data, boardId);
        messagingTemplate.convertAndSend("/topic/board/" + boardId, notification);
        System.out.println("WS notification sent: " + type + " to board " + boardId);
    }

    public record BoardNotification(String type, Object data, String boardId) {
    }
}