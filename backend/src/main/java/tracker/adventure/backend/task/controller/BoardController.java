package tracker.adventure.backend.task.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.auth.model.User;
import tracker.adventure.backend.task.dto.BoardDto;
import tracker.adventure.backend.task.dto.ColumnDto;
import tracker.adventure.backend.task.dto.TaskDto;
import tracker.adventure.backend.task.model.Board;
import tracker.adventure.backend.task.model.BoardColumn;
import tracker.adventure.backend.task.model.Task;
import tracker.adventure.backend.task.service.BoardService;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // ─── Boards ───────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<BoardDto> createBoard(@RequestBody CreateBoardRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Board board = boardService.createBoard(request.name(), request.description(), user);
        return ResponseEntity.ok(BoardDto.from(board));
    }

    @GetMapping
    public ResponseEntity<List<BoardDto>> getMyBoards(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(
                boardService.getMyBoards(user).stream()
                        .map(BoardDto::from)
                        .toList());
    }

    // ─── Columns ──────────────────────────────────────────────

    @PostMapping("/{boardId}/columns")
    public ResponseEntity<ColumnDto> createColumn(@PathVariable String boardId,
            @RequestBody CreateColumnRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        BoardColumn column = boardService.createColumn(boardId, request.name(), user);
        return ResponseEntity.ok(ColumnDto.from(column));
    }

    @GetMapping("/{boardId}/columns")
    public ResponseEntity<List<ColumnDto>> getColumns(@PathVariable String boardId) {
        return ResponseEntity.ok(
                boardService.getColumns(boardId).stream()
                        .map(ColumnDto::from)
                        .toList());
    }

    // ─── Tasks ────────────────────────────────────────────────

    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<TaskDto> createTask(@PathVariable String columnId,
            @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Task task = boardService.createTask(columnId, request.title(), request.description(), user);
        return ResponseEntity.ok(TaskDto.from(task));
    }

    @GetMapping("/columns/{columnId}/tasks")
    public ResponseEntity<List<TaskDto>> getTasks(@PathVariable String columnId) {
        return ResponseEntity.ok(
                boardService.getTasks(columnId).stream()
                        .map(TaskDto::from)
                        .toList());
    }

    @PatchMapping("/tasks/{taskId}/move")
    public ResponseEntity<TaskDto> moveTask(@PathVariable String taskId,
            @RequestBody MoveTaskRequest request) {
        Task task = boardService.moveTask(taskId, request.columnId(), request.position());
        return ResponseEntity.ok(TaskDto.from(task));
    }

    // ─── Request records ──────────────────────────────────────

    record CreateBoardRequest(String name, String description) {
    }

    record CreateColumnRequest(String name) {
    }

    record CreateTaskRequest(String title, String description) {
    }

    record MoveTaskRequest(String columnId, Integer position) {
    }
}