package ohka39.oudocumenthub.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.models.CommentImage;

import java.util.List;
import java.util.UUID;

public interface CommentImageRepository extends JpaRepository<CommentImage, UUID> {
    List<CommentImage> findByCommentCommentId(UUID commentId);
}
