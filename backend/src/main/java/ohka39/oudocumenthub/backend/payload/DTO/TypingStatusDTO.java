package ohka39.oudocumenthub.backend.payload.DTO;

import java.util.UUID;

public class TypingStatusDTO {
    private UUID roomId;

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    private UUID userId;
    private boolean isTyping;
    private String avatarLink;

    public String getAvatarLink() {
        return avatarLink;
    }

    public void setAvatarLink(String avatarLink) {
        this.avatarLink = avatarLink;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setIsTyping(boolean isTyping) {
        this.isTyping = isTyping;
    }

    public UUID getUserId() {
        return userId;
    }

    public boolean isTyping() {
        return isTyping;
    }
}
