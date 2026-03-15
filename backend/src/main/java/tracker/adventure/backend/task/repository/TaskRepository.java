package tracker.adventure.backend.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tracker.adventure.backend.task.model.BoardColumn;
import tracker.adventure.backend.task.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {
    List<Task> findByColumnOrderByPositionAsc(BoardColumn column);
}