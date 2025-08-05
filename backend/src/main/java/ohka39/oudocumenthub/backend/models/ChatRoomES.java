
package ohka39.oudocumenthub.backend.models;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ChatRoomES {
    private UUID roomId;
    private UUID otherUserId;
    private String firstName;
    private String lastName;
    private String avatarLink;
    private String lastMessageContent;
    private LocalDateTime lastMessageTime;
    private long unreadCount;
    private boolean isPinned;
}
