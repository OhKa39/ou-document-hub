package ohka39.oudocumenthub.backend.models;

import lombok.Data;
import java.io.Serializable;
import java.util.UUID;

@Data
public class CommentLikeId implements Serializable {
    private UUID userId;
    private UUID commentId;
}
