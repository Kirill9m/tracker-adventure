package tracker.adventure.backend.task.dto;

import tracker.adventure.backend.task.model.BoardColumn;

public record ColumnDto(
        String id,
        String name,
        Integer position,
        String boardId) {
    public static ColumnDto from(BoardColumn column) {
        return new ColumnDto(
                column.getId(),
                column.getName(),
                column.getPosition(),
                column.getBoard().getId());
    }
}