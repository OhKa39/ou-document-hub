package ohka39.oudocumenthub.backend.repositories;

import java.net.http.WebSocket.Listener;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findById(UUID id);

    Optional<User> findByEmail(String email);

    long countByCreatedAtBefore(LocalDateTime dateTime);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :start AND u.createdAt < :end")
    long countByCreatedAtBetween(LocalDateTime start, java.time.LocalDateTime end);

}
