
package ohka39.oudocumenthub.backend.services.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.models.Comment;
import ohka39.oudocumenthub.backend.models.CommentImage;
import ohka39.oudocumenthub.backend.models.CommentLike;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.CommentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ReplyDTO;
import ohka39.oudocumenthub.backend.payload.mapper.CommentMapper;
import ohka39.oudocumenthub.backend.repositories.CommentImageRepository;
import ohka39.oudocumenthub.backend.repositories.CommentLikeRepository;
import ohka39.oudocumenthub.backend.repositories.CommentRepository;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.ICommentService;

import java.io.IOException;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentServiceImpl implements ICommentService {

    private final CommentRepository commentRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;
    private final CommentImageRepository commentImageRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final CommentLikeRepository commentLikeRepository;
    private final String COMMENT_IMAGE_DIR = "comment-image/";
    private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String BUCKET_NAME;

    private final ApplicationEventPublisher eventPublisher;

    @Override
    public Page<CommentDTO> getCommentsByDocumentId(UUID documentId, int page, int size, String sort, String filter) {
        Sort sortCriteria;
        switch (sort) {
            case "newest":
                sortCriteria = Sort.by(Sort.Direction.DESC, "createdAt");
                break;
            case "oldest":
                sortCriteria = Sort.by(Sort.Direction.ASC, "createdAt");
                break;
            case "mostLiked":
                sortCriteria = Sort.by(Sort.Direction.DESC, "likes");
                break;
            default:
                sortCriteria = Sort.by(Sort.Direction.DESC, "createdAt");
        }
        Pageable pageable = PageRequest.of(page, size, sortCriteria);

        Page<Comment> topLevelComments;
        switch (filter) {
            case "5star":
                topLevelComments = commentRepository.findTopLevelCommentsByRating(documentId, 5, pageable);
                break;
            case "4star":
                topLevelComments = commentRepository.findTopLevelCommentsByRating(documentId, 4, pageable);
                break;
            case "3star":
                topLevelComments = commentRepository.findTopLevelCommentsByRating(documentId, 3, pageable);
                break;
            case "2star":
                topLevelComments = commentRepository.findTopLevelCommentsByRating(documentId, 2, pageable);
                break;
            case "1star":
                topLevelComments = commentRepository.findTopLevelCommentsByRating(documentId, 1, pageable);
                break;
            case "withPhotos":
                topLevelComments = commentRepository.findTopLevelCommentsWithPhotos(documentId, pageable);
                break;
            default:
                topLevelComments = commentRepository.findTopLevelComments(documentId, pageable);
        }

        List<CommentDTO> commentDTOs = topLevelComments.getContent().stream()
                .map(commentMapper::mapToCommentDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(commentDTOs, pageable, topLevelComments.getTotalElements());
    }

    @Override
    public Page<CommentDTO> getRepliesByParentId(UUID documentId, UUID parentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Comment> replies = commentRepository.findRepliesByParentId(documentId, parentId, pageable);

        List<CommentDTO> replyDTOs = replies.getContent().stream()
                .map(commentMapper::mapToCommentDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(replyDTOs, pageable, replies.getTotalElements());
    }

    @Override
    @Transactional
    public CommentDTO createComment(UUID documentId, CommentDTO commentDTO, UUID userId, List<MultipartFile> images)
            throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setCommentId(UUID.randomUUID());
        comment.setDocument(document);
        comment.setCreatedBy(user);
        comment.setLikes(0);
        comment.setDetail(commentDTO.getComment());
        comment.setRating(commentDTO.getRating());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setLft(1);
        comment.setRgt(2);

        commentRepository.shiftRightValues(documentId, 1);
        commentRepository.shiftLeftValues(documentId, 1);

        comment = commentRepository.save(comment);
        List<String> imageUrls = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                String randomFileName = UUID.randomUUID().toString();
                eventPublisher.publishEvent(new OnUploadFile(COMMENT_IMAGE_DIR + randomFileName, file));
                URL url = s3Client.getUrl(BUCKET_NAME, COMMENT_IMAGE_DIR + randomFileName);
                CommentImage commentImage = new CommentImage();
                commentImage.setComment(comment);
                commentImage.setImageUrl(url.toExternalForm());
                commentImage.setCreatedAt(LocalDateTime.now());
                commentImageRepository.save(commentImage);
                imageUrls.add(commentImage.getImageUrl());
            }
        }
        CommentDTO result = commentMapper.mapToCommentDTO(comment);
        result.setImages(imageUrls);
        messagingTemplate.convertAndSend("/topic/comments/" + documentId, result);
        return result;
    }

    @Override
    @Transactional
    public CommentDTO createReply(UUID documentId, UUID parentId, CommentDTO commentDTO, UUID userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        Comment reply = new Comment();
        reply.setCommentId(UUID.randomUUID());
        reply.setDocument(document);
        reply.setCreatedBy(user);
        reply.setDetail(commentDTO.getComment());
        reply.setRating(commentDTO.getRating());
        reply.setParentId(parentId);
        reply.setCreatedAt(LocalDateTime.now());

        int rgt = parent.getRgt();
        reply.setLft(rgt);
        reply.setRgt(rgt + 1);

        commentRepository.shiftRightValues(documentId, rgt);
        commentRepository.shiftLeftValues(documentId, rgt);

        reply = commentRepository.save(reply);
        CommentDTO result = commentMapper.mapToCommentDTO(reply);
        log.debug("Sending WebSocket message for reply: {}", result);
        messagingTemplate.convertAndSend("/topic/comments/" + documentId, result);
        return result;
    }

    @Override
    @Transactional
    public CommentDTO likeComment(UUID commentId, UUID userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        boolean checkLike = commentLikeRepository.existsByUserIdAndCommentId(userId, commentId);
        if (!checkLike) {
            comment.setLikes(comment.getLikes() + 1);
            comment = commentRepository.save(comment);

            CommentLike commentLike = new CommentLike();
            commentLike.setUserId(userId);
            commentLike.setCommentId(commentId);
            commentLike.setCreatedAt(LocalDateTime.now());
            commentLikeRepository.save(commentLike);
        } else {
            comment.setLikes(comment.getLikes() - 1);
            comment = commentRepository.save(comment);

            commentLikeRepository.deleteByUserIdAndCommentId(userId, commentId);
        }

        CommentDTO result = commentMapper.mapToCommentDTO(comment);
        result.setLiked(checkLike ? false : true);
        messagingTemplate.convertAndSend("/topic/comments/" + comment.getDocument().getDocumentId(), result);
        return result;
    }
}
