
package ohka39.oudocumenthub.backend.services.interfaces;

import ohka39.oudocumenthub.backend.payload.DTO.CommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface ICommentService {

    Page<CommentDTO> getCommentsByDocumentId(UUID documentId, int page, int size, String sort, String filter);

    CommentDTO createComment(UUID documentId, CommentDTO commentDTO, UUID userId, List<MultipartFile> images)
            throws IOException;

    CommentDTO createReply(UUID documentId, UUID parentId, CommentDTO commentDTO, UUID userId);

    CommentDTO likeComment(UUID commentId, UUID userId);

    public Page<CommentDTO> getRepliesByParentId(UUID documentId, UUID parentId, int page, int size);
}
