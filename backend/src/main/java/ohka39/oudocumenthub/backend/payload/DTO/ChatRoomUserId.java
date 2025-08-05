package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;

import java.io.Serializable;
import java.util.UUID;

@Data
public class ChatRoomUserId implements Serializable {
    private UUID roomId;
    private UUID userId;
}
