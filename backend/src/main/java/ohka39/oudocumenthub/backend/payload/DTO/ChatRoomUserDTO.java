
package ohka39.oudocumenthub.backend.payload.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ChatRoomUserDTO {
    private String id; // room_id_user_id
    private String roomId;
    private String userId;
    private String lastMessageRead;
    private LocalDateTime createdAt;
}
