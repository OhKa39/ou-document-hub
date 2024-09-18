package ohka39.oudocumenthub.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RedisHash(value = "refresh-token", timeToLive = 60 * 60 * 24 * 30)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
	@Id
	private String refreshToken;
	@Indexed
	private String userId;
}
