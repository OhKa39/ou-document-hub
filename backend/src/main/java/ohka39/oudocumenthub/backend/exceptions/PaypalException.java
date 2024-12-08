package ohka39.oudocumenthub.backend.exceptions;

import lombok.Getter;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalExceptionDTO;

@Getter
public class PaypalException extends RuntimeException {
    private long statusCode;
    private PaypalExceptionDTO exceptionDTO;

    public PaypalException(String message, long statusCode, PaypalExceptionDTO exceptionDTO) {
        super(message);
        this.statusCode = statusCode;
        this.exceptionDTO = exceptionDTO;
    }
}
