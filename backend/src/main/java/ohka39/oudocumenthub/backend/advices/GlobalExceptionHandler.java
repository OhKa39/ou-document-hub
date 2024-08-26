package ohka39.oudocumenthub.backend.advices;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.exceptions.User.EntityAlreadyExistsException;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    //Handler validation error
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> responseEntity = new HashMap<>();

        Map<String, String> errorMapper = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError)error).getField();
            String errorMessage = error.getDefaultMessage();
            errorMapper.put(fieldName, errorMessage);
        });
        
        responseEntity.put("status: ", "failed");
        responseEntity.put("data", errorMapper);
        responseEntity.put("message", "validation failed");

        return responseEntity;
    }

    //Handler unknown server error
    /**
     * @param ex
     * @return
     */
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleServerExceptions(Exception ex) {
        Map<String, Object> responseEntity = new HashMap<>();

        responseEntity.put("status: ", "error");
        responseEntity.put("data", null);
        responseEntity.put("message", "internal server error");

        log.info("error show stack: {}", ex.getMessage());

        return responseEntity;
    }

    //handler instance has existed in database
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(EntityAlreadyExistsException.class)
    public Map<String, Object> handleEntityAlreadyExistsException(EntityAlreadyExistsException ex) {

        Map<String, Object> responseEntity = new HashMap<>();
        responseEntity.put("status: ", "error");
        responseEntity.put("data", null);
        responseEntity.put("message", ex.getMessage());

        return responseEntity;
    }
}
