package ohka39.oudocumenthub.backend.repositories;

import ohka39.oudocumenthub.backend.models.Message;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.StackWalker.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    long countByRoomRoomIdAndSenderUserIdNotAndMessageIdGreaterThan(UUID roomId, UUID senderUserId, UUID messageId);

    long countByRoomRoomIdAndSenderUserIdNot(UUID roomId, UUID senderUserId);

    List<Message> findByRoomRoomId(UUID roomId);

    Optional<Message> findTopByRoomRoomIdOrderByCreatedAtDesc(UUID roomId);

    List<Message> findByRoomRoomIdOrderByCreatedAtAsc(UUID roomId);

    long countByRoomRoomIdAndIsReadFalseAndSenderUserIdNot(UUID roomId, UUID senderUserId);

    List<Message> findByRoomRoomIdOrderByCreatedAtDesc(UUID roomId, Pageable pageable);

    List<Message> findByRoomRoomIdAndCreatedAtLessThanOrderByCreatedAtDesc(UUID roomId, LocalDateTime before,

            Pageable pageable);

    Optional<Message> findTopByRoomRoomId(UUID roomId);
}
