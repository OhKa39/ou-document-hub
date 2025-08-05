package ohka39.oudocumenthub.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDateTime;

@Document(indexName = "chat_room_users")
public class ChatRoomUserES {
    @Id
    private String id;

    @Field(type = FieldType.Keyword)
    private String roomId;

    @Field(type = FieldType.Keyword)
    private String userId;

    @Field(type = FieldType.Text, name = "other_user_name")
    private String otherUserName;

    @Field(type = FieldType.Text, name = "user_first_name")
    private String userFirstName;

    @Field(type = FieldType.Text, name = "user_last_name")
    private String userLastName;

    @Field(type = FieldType.Keyword)
    private String lastMessageRead;

    @Field(type = FieldType.Date, format = {}, pattern = "strict_date_time||epoch_millis")
    private LocalDateTime lastMessageReadTime;

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOtherUserName() {
        return otherUserName;
    }

    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }

    public String getUserFirstName() {
        return userFirstName;
    }

    public void setUserFirstName(String userFirstName) {
        this.userFirstName = userFirstName;
    }

    public String getUserLastName() {
        return userLastName;
    }

    public void setUserLastName(String userLastName) {
        this.userLastName = userLastName;
    }

    public String getLastMessageRead() {
        return lastMessageRead;
    }

    public void setLastMessageRead(String lastMessageRead) {
        this.lastMessageRead = lastMessageRead;
    }

    public LocalDateTime getLastMessageReadTime() {
        return lastMessageReadTime;
    }

    public void setLastMessageReadTime(LocalDateTime lastMessageReadTime) {
        this.lastMessageReadTime = lastMessageReadTime;
    }
}
