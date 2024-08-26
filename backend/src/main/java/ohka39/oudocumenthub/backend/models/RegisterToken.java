package ohka39.oudocumenthub.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RedisHash(value = "register-token", timeToLive = 300)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterToken {
    @Id
    private String registerTokenId;
    private String email;
}
