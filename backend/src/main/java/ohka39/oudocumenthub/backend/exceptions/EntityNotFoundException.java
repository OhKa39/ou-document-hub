package ohka39.oudocumenthub.backend.exceptions;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends RuntimeException {
    private long statusCode;

    public EntityNotFoundException(String message, long statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
