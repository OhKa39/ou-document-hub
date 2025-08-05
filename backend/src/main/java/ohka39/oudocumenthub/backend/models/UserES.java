package ohka39.oudocumenthub.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Data
@Document(indexName = "users")
public class UserES {
    @Id
    private String id;

    @Field(name = "user_id", type = FieldType.Keyword)
    @JsonProperty("user_id")
    private UUID userId;

    @Field(name = "first_name", type = FieldType.Text)
    @JsonProperty("first_name")
    private String firstName;

    @Field(name = "last_name", type = FieldType.Text)
    @JsonProperty("last_name")
    private String lastName;

    @Field(name = "is_verified", type = FieldType.Boolean)
    @JsonProperty("is_verified")
    private Boolean isVerified;

    @Field(name = "is_banned", type = FieldType.Boolean)
    @JsonProperty("is_banned")
    private Boolean isBanned;

    @Field(name = "is_enable", type = FieldType.Boolean)
    @JsonProperty("is_enable")
    private Boolean isEnable;

    @Field(name = "avatar_link", type = FieldType.Keyword)
    @JsonProperty("avatar_link")
    private String avatarLink;

    @Field(name = "account_type", type = FieldType.Keyword)
    @JsonProperty("account_type")
    private String accountType;

    @Field(name = "merchant_id", type = FieldType.Keyword)
    @JsonProperty("merchant_id")
    private String merchantId;

    @Field(name = "provider", type = FieldType.Keyword)
    @JsonProperty("provider")
    private String provider;

    @Field(name = "email", type = FieldType.Text)
    @JsonProperty("email")
    private String email;

    @Field(name = "gender", type = FieldType.Keyword)
    @JsonProperty("gender")
    private String gender;

    @Field(name = "roles", type = FieldType.Keyword)
    @JsonProperty("roles")
    private List<String> roles;

    @Field(name = "created_at", type = FieldType.Date)
    @JsonProperty("created_at")
    private Date createdAt;

    @Field(name = "updated_at", type = FieldType.Date)
    @JsonProperty("updated_at")
    private Date updatedAt;

    @Field(name = "si_created_at", type = FieldType.Date)
    @JsonProperty("si_created_at")
    private Date siCreatedAt;

    @Field(name = "si_updated_at", type = FieldType.Date)
    @JsonProperty("si_updated_at")
    private Date siUpdatedAt;

    @Field(name = "date_of_birth", type = FieldType.Date)
    @JsonProperty("date_of_birth")
    private Date dateOfBirth;

    @Field(name = "@timestamp", type = FieldType.Date)
    @JsonProperty("@timestamp")
    private Date timestamp;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserES userES = (UserES) o;
        return Objects.equals(userId, userES.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }
}
