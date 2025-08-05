
package ohka39.oudocumenthub.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.payload.DTO.CommentDTO;
import ohka39.oudocumenthub.backend.services.interfaces.ICommentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/${api-route}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;

    /**
     * Retrieve paginated comments for a document.
     *
     * @param documentId Document UUID
     * @param page       Page number (default: 0)
     * @param size       Page size (default: 10)
     * @param sort       Sort order (e.g., newest, oldest, mostLiked)
     * @param filter     Filter (e.g., all, 5star, withPhotos)
     * @return Paginated CommentDTO list
     */
    @GetMapping("/document/{documentId}")
    public ResponseEntity<Page<CommentDTO>> getCommentsByDocumentId(
            @PathVariable UUID documentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "all") String filter) {
        if (documentId == null) {
            throw new IllegalArgumentException("Document ID must not be null");
        }
        Page<CommentDTO> comments = commentService.getCommentsByDocumentId(documentId, page, size, sort, filter);
        return ResponseEntity.ok(comments);
    }

    /**
     * Retrieve paginated replies for a parent comment.
     *
     * @param documentId Document UUID
     * @param parentId   Parent comment UUID
     * @param page       Page number (default: 0)
     * @param size       Page size (default: 5)
     * @return Paginated CommentDTO list
     */
    @GetMapping("/document/{documentId}/replies")
    public ResponseEntity<Page<CommentDTO>> getRepliesByParentId(
            @PathVariable UUID documentId,
            @RequestParam UUID parentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        if (documentId == null || parentId == null) {
            throw new IllegalArgumentException("Document ID and Parent ID must not be null");
        }
        Page<CommentDTO> replies = commentService.getRepliesByParentId(documentId, parentId, page, size);
        return ResponseEntity.ok(replies);
    }

    /**
     * Create a new comment with optional images.
     *
     * @param documentId Document UUID
     * @param commentDTO Comment data (validated)
     * @param userId     User UUID from header
     * @param images     Optional image files
     * @return Created CommentDTO
     * @throws IOException If image upload fails
     */
    @PostMapping("/document/{documentId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable UUID documentId,
            @RequestPart(value = "comment") @Valid CommentDTO commentDTO,
            @RequestHeader("User-Id") UUID userId,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        if (documentId == null || userId == null) {
            throw new IllegalArgumentException("Document ID and User ID must not be null");
        }
        if (commentDTO.getComment() == null || commentDTO.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content must not be empty");
        }
        // Ensure variant is set
        if (commentDTO.getVariant() == null) {
            commentDTO.setVariant("default");
        }
        CommentDTO result = commentService.createComment(documentId, commentDTO, userId, images);
        result.setLiked(false); // New comment is not liked
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Create a reply to a parent comment.
     *
     * @param documentId Document UUID
     * @param parentId   Parent comment UUID
     * @param commentDTO Reply data (validated)
     * @param userId     User UUID from header
     * @return Created CommentDTO
     */
    @PostMapping("/document/{documentId}/reply/{parentId}")
    public ResponseEntity<CommentDTO> createReply(
            @PathVariable UUID documentId,
            @PathVariable UUID parentId,
            @RequestBody @Valid CommentDTO commentDTO,
            @RequestHeader("User-Id") UUID userId) {
        if (documentId == null || parentId == null || userId == null) {
            throw new IllegalArgumentException("Document ID, Parent ID, and User ID must not be null");
        }
        if (commentDTO.getComment() == null || commentDTO.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Reply content must not be empty");
        }
        // Ensure variant is set
        if (commentDTO.getVariant() == null) {
            commentDTO.setVariant("default");
        }
        CommentDTO result = commentService.createReply(documentId, parentId, commentDTO, userId);
        result.setLiked(false); // New reply is not liked
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    /**
     * Like or unlike a comment.
     *
     * @param commentId Comment UUID
     * @param userId    User UUID from header
     * @return Updated CommentDTO
     */
    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentDTO> likeComment(
            @PathVariable UUID commentId,
            @RequestHeader("User-Id") UUID userId) {
        if (commentId == null || userId == null) {
            throw new IllegalArgumentException("Comment ID and User ID must not be null");
        }
        CommentDTO result = commentService.likeComment(commentId, userId);
        return ResponseEntity.ok(result);
    }

}
