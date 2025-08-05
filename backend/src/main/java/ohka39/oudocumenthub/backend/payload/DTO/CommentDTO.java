package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class CommentDTO {
    private String id;
    private UserDTO user;
    private int rating;
    private String date;
    private String variant;
    private String comment;
    private List<String> images;
    private int likes;
    private List<ReplyDTO> replies;
    private boolean liked;
    private String parentId;
    private long replyCount;
}
