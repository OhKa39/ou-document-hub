package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class MessageDTO {
    private UUID messageId;
    private UUID senderId;
    private String senderName;
    private UUID roomId;
    private String content;
    private LocalDateTime createdAt;
    private UUID replyId;
    private UUID recipientId;
}
