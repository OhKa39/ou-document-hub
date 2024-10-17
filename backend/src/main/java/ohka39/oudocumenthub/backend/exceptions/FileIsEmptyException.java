package ohka39.oudocumenthub.backend.exceptions;

import lombok.Getter;

@Getter
public class FileIsEmptyException extends RuntimeException {
    private long statusCode;

    public FileIsEmptyException(String message, long statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
