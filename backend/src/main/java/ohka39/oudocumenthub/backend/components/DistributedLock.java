package ohka39.oudocumenthub.backend.components;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class DistributedLock {

    private final RedisTemplate<String, String> redisTemplate;

    public DistributedLock(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public boolean acquireLock(String lockKey, String lockValue, long timeoutSeconds) {
        Boolean success = redisTemplate.opsForValue().setIfAbsent(lockKey, lockValue,
                Duration.ofSeconds(timeoutSeconds));
        return success != null && success;
    }

    public void releaseLock(String lockKey, String lockValue) {
        String currentValue = redisTemplate.opsForValue().get(lockKey);
        if (lockValue.equals(currentValue)) {
            redisTemplate.delete(lockKey);
        }
    }
}
