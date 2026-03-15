package tracker.adventure.backend.task.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tracker.adventure.backend.auth.model.User;
import tracker.adventure.backend.task.model.Board;

@Repository
public interface BoardRepository extends JpaRepository<Board, String> {
    List<Board> findByOwner(User owner);
}