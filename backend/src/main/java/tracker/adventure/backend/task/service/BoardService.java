package tracker.adventure.backend.task.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.auth.model.User;
import tracker.adventure.backend.notification.NotificationService;
import tracker.adventure.backend.task.model.Board;
import tracker.adventure.backend.task.model.BoardColumn;
import tracker.adventure.backend.task.model.Task;
import tracker.adventure.backend.task.repository.BoardColumnRepository;
import tracker.adventure.backend.task.repository.BoardRepository;
import tracker.adventure.backend.task.repository.TaskRepository;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardColumnRepository columnRepository;
    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    // ─── Boards ───────────────────────────────────────────────

    public Board createBoard(String name, String description, User owner) {
        Board board = new Board();
        board.setName(name);
        board.setDescription(description);
        board.setOwner(owner);
        return boardRepository.save(board);
    }

    public List<Board> getMyBoards(User owner) {
        return boardRepository.findByOwner(owner);
    }

    public Board getBoard(String boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));
    }

    // ─── Columns ──────────────────────────────────────────────

    public BoardColumn createColumn(String boardId, String name, User owner) {
        Board board = getBoard(boardId);
        if (!board.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("Access denied");
        }
        List<BoardColumn> existing = columnRepository.findByBoardOrderByPositionAsc(board);

        BoardColumn column = new BoardColumn();
        column.setName(name);
        column.setBoard(board);
        column.setPosition(existing.size());
        columnRepository.save(column);

        notificationService.notifyBoardUpdated(
                boardId,
                "COLUMN_CREATED",
                Map.of("columnId", column.getId(), "name", column.getName()));
        return column;
    }

    public List<BoardColumn> getColumns(String boardId) {
        Board board = getBoard(boardId);
        return columnRepository.findByBoardOrderByPositionAsc(board);
    }

    // ─── Tasks ────────────────────────────────────────────────

    public Task createTask(String columnId, String title, String description, User assignee) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new RuntimeException("Column not found"));

        List<Task> existing = taskRepository.findByColumnOrderByPositionAsc(column);

        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setColumn(column);
        task.setAssignee(assignee);
        task.setPosition(existing.size());
        taskRepository.save(task);

        notificationService.notifyBoardUpdated(
                column.getBoard().getId(),
                "TASK_CREATED",
                Map.of("taskId", task.getId(), "title", task.getTitle(), "columnId", column.getId()));
        return task;
    }

    public List<Task> getTasks(String columnId) {
        BoardColumn column = columnRepository.findById(columnId)
                .orElseThrow(() -> new RuntimeException("Column not found"));
        return taskRepository.findByColumnOrderByPositionAsc(column);
    }

    public Task moveTask(String taskId, String targetColumnId, Integer newPosition) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        BoardColumn targetColumn = columnRepository.findById(targetColumnId)
                .orElseThrow(() -> new RuntimeException("Column not found"));

        task.setColumn(targetColumn);
        task.setPosition(newPosition);
        taskRepository.save(task);

        notificationService.notifyBoardUpdated(
                targetColumn.getBoard().getId(),
                "TASK_MOVED",
                Map.of("taskId", task.getId(), "fromColumn", task.getColumn().getId(), "toColumn", targetColumnId));
        return task;
    }
}