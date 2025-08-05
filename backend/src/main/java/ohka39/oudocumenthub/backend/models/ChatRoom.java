package ohka39.oudocumenthub.backend.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "chat_rooms")
@Data
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "room_id")
    private UUID roomId;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    Set<ChatRoomUser> chatRoomUsers;
}
