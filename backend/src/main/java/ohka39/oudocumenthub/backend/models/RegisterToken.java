package ohka39.oudocumenthub.backend.models;

import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RedisHash(value = "register-token", timeToLive = 60 * 60 * 24 * 3)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterToken {
    @Id
    private String email;
    @Indexed
    private String registerTokenId;
}
