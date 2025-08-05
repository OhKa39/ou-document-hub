// ReadMessageDto.java
package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;

import java.util.UUID;

@Data
public class ReadMessageDTO {
    private UUID roomId;
    private UUID userId;
    private UUID messageId;
}
