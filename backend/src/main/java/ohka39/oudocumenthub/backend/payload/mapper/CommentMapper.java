package ohka39.oudocumenthub.backend.payload.mapper;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.models.Comment;
import ohka39.oudocumenthub.backend.payload.DTO.CommentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ReplyDTO;
import ohka39.oudocumenthub.backend.repositories.CommentRepository;

@RequiredArgsConstructor
@Component
public class CommentMapper {
    private final UserMapper userMapper;
    private final CommentRepository commentRepository;

    public CommentDTO mapToCommentDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getCommentId().toString());
        dto.setComment(comment.getDetail());
        dto.setRating(comment.getRating());
        dto.setLikes(comment.getLikes());
        dto.setDate(comment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE));
        dto.setVariant(""); // Not stored in DB, set as empty or map from elsewhere if needed
        dto.setReplyCount(
                commentRepository.countRepliesByParentId(comment.getDocument().getDocumentId(),
                        comment.getCommentId()));
        if (comment.getCommentImages() != null) {
            dto.setImages(comment.getCommentImages().stream().map(commentImage -> commentImage.getImageUrl())
                    .collect(Collectors.toList())); // Add logic to fetch from document_images if needed
        }
        if (comment.getParentId() != null) {
            dto.setParentId(comment.getParentId().toString());
        }
        dto.setUser(userMapper.toUserDocumentDetailDTO(comment.getCreatedBy()));
        dto.setReplies(new ArrayList<>());
        return dto;
    }

    public ReplyDTO mapToReplyDTO(Comment comment) {
        ReplyDTO dto = new ReplyDTO();
        dto.setId(comment.getCommentId().toString());
        dto.setComment(comment.getDetail());
        dto.setDate(comment.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE));
        dto.setUser(userMapper.toUserDocumentDetailDTO(comment.getCreatedBy()));
        return dto;
    }
}
