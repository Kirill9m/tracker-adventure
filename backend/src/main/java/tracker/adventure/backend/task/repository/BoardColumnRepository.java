package tracker.adventure.backend.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tracker.adventure.backend.task.model.Board;
import tracker.adventure.backend.task.model.BoardColumn;

@Repository
public interface BoardColumnRepository extends JpaRepository<BoardColumn, String> {
    List<BoardColumn> findByBoardOrderByPositionAsc(Board board);
}