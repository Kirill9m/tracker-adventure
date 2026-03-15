package tracker.adventure.backend.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import tracker.adventure.backend.auth.model.User;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    Optional<User> findByGithubLogin(String githubLogin);

    boolean existsByEmail(String email);
}
