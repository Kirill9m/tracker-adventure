package tracker.adventure.backend.task.dto;

import java.time.LocalDateTime;

import tracker.adventure.backend.auth.dto.UserDto;
import tracker.adventure.backend.task.model.Board;

public record BoardDto(
        String id,
        String name,
        String description,
        UserDto owner,
        LocalDateTime createdAt) {
    public static BoardDto from(Board board) {
        return new BoardDto(
                board.getId(),
                board.getName(),
                board.getDescription(),
                UserDto.from(board.getOwner()),
                board.getCreatedAt());
    }
}