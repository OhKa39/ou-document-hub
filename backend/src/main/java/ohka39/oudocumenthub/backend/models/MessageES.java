package ohka39.oudocumenthub.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;

@Data
@Document(indexName = "messages")
public class MessageES {
    @Id
    private String id;

    @Field(name = "sender_id", type = FieldType.Keyword)
    private String senderId;

    @Field(name = "chat_room_id", type = FieldType.Keyword)
    private String chatRoomId;

    @Field(name = "message_text", type = FieldType.Text)
    private String messageText;

    @Field(name = "created_at", type = FieldType.Date)
    private ZonedDateTime createdAt;

    @Field(name = "reply_id", type = FieldType.Keyword)
    private String replyId;

    @Field(name = "is_edit", type = FieldType.Boolean)
    private Boolean isEdit;

    @Field(name = "is_delete", type = FieldType.Boolean)
    private Boolean isDelete;

    @Field(name = "sender_name", type = FieldType.Text)
    private String senderName;

    @Field(name = "sender_first_name", type = FieldType.Text)
    private String senderFirstName;

    @Field(name = "sender_last_name", type = FieldType.Text)
    private String senderLastName;

    @Field(name = "sender_email", type = FieldType.Keyword)
    private String senderEmail;
}
