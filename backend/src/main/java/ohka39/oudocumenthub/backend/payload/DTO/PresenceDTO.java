package ohka39.oudocumenthub.backend.payload.DTO;

import java.util.UUID;

public class PresenceDTO {

    private UUID userId;
    private boolean isOnline;

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setIsOnline(boolean isOnline) {
        this.isOnline = isOnline;
    }

    public UUID getUserId() {
        return userId;
    }

    public boolean isOnline() {
        return isOnline;
    }
}
