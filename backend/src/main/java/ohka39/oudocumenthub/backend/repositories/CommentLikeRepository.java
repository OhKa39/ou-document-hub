
package ohka39.oudocumenthub.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.CommentLike;
import ohka39.oudocumenthub.backend.models.CommentLikeId;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {
    boolean existsByUserIdAndCommentId(UUID userId, UUID commentId);

    void deleteByUserIdAndCommentId(UUID userId, UUID commentId);
}
