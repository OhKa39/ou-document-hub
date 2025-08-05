package ohka39.oudocumenthub.backend.exceptions;

import lombok.Getter;

public class PaypalInstrumentDeclinedException extends RuntimeException {

    @Getter
    private long statusCode;

    public PaypalInstrumentDeclinedException(String message, long statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

}
