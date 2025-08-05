package ohka39.oudocumenthub.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.core.suggest.Completion;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Document(indexName = "documents_v2")
@Setting(settingPath = "/elasticsearch/settings.json")
public class DocumentES {

    @Id
    @JsonProperty("document_id")
    private UUID documentId;

    @JsonProperty("rating")
    @Field(type = FieldType.Double)
    private Double rating;

    @JsonProperty("document_type")
    @MultiField(mainField = @Field(name = "document_type", type = FieldType.Text), otherFields = {
            @InnerField(suffix = "keyword", type = FieldType.Keyword) })
    private String documentType;

    @JsonProperty("document_name")
    @MultiField(mainField = @Field(name = "document_name", type = FieldType.Text, analyzer = "standard"), otherFields = {
            @InnerField(suffix = "keyword", type = FieldType.Keyword) })
    private String documentName;

    @JsonProperty("status")
    @Field(name = "status", type = FieldType.Keyword)
    private String status;

    @JsonProperty("created_at")
    @Field(name = "created_at", type = FieldType.Date, format = DateFormat.date_time, pattern = "uuuu-MM-dd'T'HH:mm:ss.SSSSSS'Z'||uuuu-MM-dd'T'HH:mm:ss.SSSSSSX||uuuu-MM-dd'T'HH:mm:ss.SSSSSS||strict_date_optional_time||epoch_millis")
    private Instant createdAt;

    @JsonProperty("updated_at")
    @Field(name = "updated_at", type = FieldType.Date, format = DateFormat.date_time, pattern = "uuuu-MM-dd'T'HH:mm:ss.SSSSSS'Z'||uuuu-MM-dd'T'HH:mm:ss.SSSSSSX||uuuu-MM-dd'T'HH:mm:ss.SSSSSS||strict_date_optional_time||epoch_millis")
    private Instant updatedAt;

    @JsonProperty("description")
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @JsonProperty("document_name_suggest")
    private Completion documentNameSuggest;

    @JsonProperty("short_url")
    @Field(name = "short_url", type = FieldType.Keyword)
    private String shortUrl;

    @JsonProperty("tag")
    @MultiField(mainField = @Field(type = FieldType.Text), otherFields = {
            @InnerField(suffix = "keyword", type = FieldType.Keyword) })
    private String tag;

    @JsonProperty("price")
    @Field(type = FieldType.Double)
    private Double price;

    @JsonProperty("thumbnail_url")
    @Field(name = "thumbnail_url", type = FieldType.Keyword)
    private String thumbnailUrl;

    @JsonProperty("is_delete")
    @Field(name = "is_delete", type = FieldType.Boolean)
    private Boolean isDelete;

    @JsonProperty("faculty_id")
    @Field(name = "faculty_id", type = FieldType.Keyword)
    private UUID facultyId;

    @JsonProperty("faculty_name")
    @Field(name = "faculty_name", type = FieldType.Text)
    private String facultyName;

    @JsonProperty("online_file_type")
    @Field(name = "online_file_type", type = FieldType.Keyword)
    private String onlineFileType;

    @JsonProperty("online_file_url")
    @Field(name = "online_file_url", type = FieldType.Keyword)
    private String onlineFileUrl;

    @JsonProperty("stock")
    @Field(type = FieldType.Integer)
    private Integer stock;

    @JsonProperty("images")
    @Field(type = FieldType.Keyword)
    private List<String> images;

    @JsonProperty("ship_addresses")
    @Field(name = "ship_addresses", type = FieldType.Keyword)
    private List<String> shipAddresses;

    @JsonProperty("created_by")
    @Field(name = "created_by", type = FieldType.Object)
    private User createdByUser;

    @Field(type = FieldType.Date, pattern = "uuuu-MM-dd'T'HH:mm:ss.SSSSSSSSS||uuuu-MM-dd'T'HH:mm:ss.SSSSSSSSSX||strict_date_optional_time")
    @JsonProperty("@timestamp")
    private Instant timestamp;

    @Data
    public static class User {
        @JsonProperty("user_id")
        @Field(name = "user_id", type = FieldType.Keyword)
        private UUID userId;

        @JsonProperty("email")
        @Field(type = FieldType.Text)
        private String email;

        @JsonProperty("avatar_link")
        @Field(name = "avatar_link", type = FieldType.Keyword)
        private String avatarLink;

        @JsonProperty("first_name")
        @Field(name = "first_name", type = FieldType.Text)
        private String firstName;

        @JsonProperty("last_name")
        @Field(name = "last_name", type = FieldType.Text)
        private String lastName;
    }
}
