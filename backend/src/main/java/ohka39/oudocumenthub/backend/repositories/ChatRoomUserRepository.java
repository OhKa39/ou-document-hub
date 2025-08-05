package ohka39.oudocumenthub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.models.ChatRoomUser;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.ChatRoomUserId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, ChatRoomUserId> {
    Optional<ChatRoomUser> findByRoomIdAndUserId(UUID roomId, UUID userId);

    List<ChatRoomUser> findByUserId(UUID userId);

    Optional<ChatRoomUser> findByRoomIdAndUserIdNot(UUID roomId, UUID userId);

    List<ChatRoomUser> findByRoomId(UUID roomId);

}
