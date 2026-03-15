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
    public ResponseEntity<Board> createBoard(@RequestBody CreateBoardRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Board board = boardService.createBoard(request.name(), request.description(), user);
        return ResponseEntity.ok(board);
    }

    @GetMapping
    public ResponseEntity<List<Board>> getMyBoards(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(boardService.getMyBoards(user));
    }

    // ─── Columns ──────────────────────────────────────────────

    @PostMapping("/{boardId}/columns")
    public ResponseEntity<BoardColumn> createColumn(@PathVariable String boardId,
            @RequestBody CreateColumnRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        BoardColumn column = boardService.createColumn(boardId, request.name(), user);
        return ResponseEntity.ok(column);
    }

    @GetMapping("/{boardId}/columns")
    public ResponseEntity<List<BoardColumn>> getColumns(@PathVariable String boardId) {
        return ResponseEntity.ok(boardService.getColumns(boardId));
    }

    // ─── Tasks ────────────────────────────────────────────────

    @PostMapping("/columns/{columnId}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable String columnId,
            @RequestBody CreateTaskRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Task task = boardService.createTask(columnId, request.title(), request.description(), user);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/columns/{columnId}/tasks")
    public ResponseEntity<List<Task>> getTasks(@PathVariable String columnId) {
        return ResponseEntity.ok(boardService.getTasks(columnId));
    }

    @PatchMapping("/tasks/{taskId}/move")
    public ResponseEntity<Task> moveTask(@PathVariable String taskId,
            @RequestBody MoveTaskRequest request) {
        Task task = boardService.moveTask(taskId, request.columnId(), request.position());
        return ResponseEntity.ok(task);
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