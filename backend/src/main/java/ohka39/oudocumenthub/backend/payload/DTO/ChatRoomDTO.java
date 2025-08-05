package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChatRoomDTO {
    private UUID roomId;
    private UUID otherUserId;
    private String firstName;
    private String lastName;
    private String avatarLink;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
    private boolean isPinned;

    public ChatRoomDTO(UUID roomId, UUID otherUserId, String firstName, String lastName, String avatarLink,
            String lastMessageContent, LocalDateTime lastMessageTime, long unreadCount, boolean isPinned) {
        this.roomId = roomId;
        this.otherUserId = otherUserId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarLink = avatarLink;
        this.lastMessageContent = lastMessageContent;
        this.lastMessageTime = lastMessageTime;
        this.unreadCount = unreadCount;
        this.isPinned = isPinned;
    }
}
