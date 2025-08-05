
package ohka39.oudocumenthub.backend.repositories;

import ohka39.oudocumenthub.backend.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Query("SELECT c FROM Comment c WHERE c.document.documentId = :documentId AND c.parentId IS NULL")
    Page<Comment> findTopLevelComments(UUID documentId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.document.documentId = :documentId AND c.parentId IS NULL AND c.rating = :rating")
    Page<Comment> findTopLevelCommentsByRating(UUID documentId, int rating, Pageable pageable);

    @Query("SELECT c FROM Comment c JOIN c.commentImages ci WHERE c.document.documentId = :documentId AND c.parentId IS NULL")
    Page<Comment> findTopLevelCommentsWithPhotos(UUID documentId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.document.documentId = :documentId AND c.lft > :lft AND c.rgt < :rgt")
    List<Comment> findReplies(UUID documentId, int lft, int rgt);

    @Query("SELECT c FROM Comment c WHERE c.document.documentId = :documentId AND c.parentId = :parentId")
    Page<Comment> findRepliesByParentId(UUID documentId, UUID parentId, Pageable pageable);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.document.documentId = :documentId AND c.parentId = :parentId")
    long countRepliesByParentId(UUID documentId, UUID parentId);

    @Modifying
    @Query("UPDATE Comment c SET c.rgt = c.rgt + 2 WHERE c.document.documentId = :documentId AND c.rgt >= :value")
    void shiftRightValues(UUID documentId, int value);

    @Modifying
    @Query("UPDATE Comment c SET c.lft = c.lft + 2 WHERE c.document.documentId = :documentId AND c.lft >= :value")
    void shiftLeftValues(UUID documentId, int value);

    long countByCreatedAtBefore(java.time.LocalDateTime dateTime);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.createdAt >= :start AND c.createdAt < :end")
    long countByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
