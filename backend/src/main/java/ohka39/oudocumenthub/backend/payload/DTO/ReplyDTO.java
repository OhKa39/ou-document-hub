package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;

@Data
public class ReplyDTO {
    private String id;
    private UserDTO user;
    private String comment;
    private String date;
}
