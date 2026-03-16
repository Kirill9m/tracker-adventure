package tracker.adventure.backend.task.dto;

import java.time.LocalDateTime;

import tracker.adventure.backend.auth.dto.UserDto;
import tracker.adventure.backend.task.model.Task;

public record TaskDto(
        String id,
        String title,
        String description,
        Integer position,
        String columnId,
        UserDto assignee,
        LocalDateTime createdAt) {
    public static TaskDto from(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPosition(),
                task.getColumn().getId(),
                task.getAssignee() != null ? UserDto.from(task.getAssignee()) : null,
                task.getCreatedAt());
    }
}