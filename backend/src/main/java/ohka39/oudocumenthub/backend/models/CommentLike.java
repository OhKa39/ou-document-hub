package ohka39.oudocumenthub.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "comment_likes")
@IdClass(CommentLikeId.class)
public class CommentLike {
    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Id
    @Column(name = "comment_id")
    private UUID commentId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
