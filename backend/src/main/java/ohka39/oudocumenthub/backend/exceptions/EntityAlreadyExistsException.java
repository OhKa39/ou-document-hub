package ohka39.oudocumenthub.backend.exceptions;

import lombok.Getter;

@Getter
public class EntityAlreadyExistsException extends RuntimeException {
    private long statusCode;

    public EntityAlreadyExistsException(String message, long statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
