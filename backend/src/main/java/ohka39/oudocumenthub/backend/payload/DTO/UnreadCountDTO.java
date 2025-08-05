package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;
import java.util.UUID;

@Getter
@Setter
public class UnreadCountDTO {
    private Map<UUID, Long> unreadCounts;
}
