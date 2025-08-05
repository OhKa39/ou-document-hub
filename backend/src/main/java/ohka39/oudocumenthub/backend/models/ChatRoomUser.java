package ohka39.oudocumenthub.backend.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import ohka39.oudocumenthub.backend.payload.DTO.ChatRoomUserId;

import java.util.UUID;

@Entity
@Table(name = "chat_rooms_users")
@Getter
@Setter
@IdClass(ChatRoomUserId.class)
public class ChatRoomUser {
    @Id
    @Column(name = "room_id")
    private UUID roomId;

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @ManyToOne
    @JoinColumn(name = "room_id", insertable = false, updatable = false)
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "last_message_read")
    private Message lastMessageRead;
}
