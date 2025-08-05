
package ohka39.oudocumenthub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.models.ChatRoom;

import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {
}
