package ohka39.oudocumenthub.backend.advices;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.exceptions.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handler validation error
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, Object> handleValidationExceptions(MethodArgumentNotValidException ex) {

        Map<String, String> errorMapper = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errorMapper.put(fieldName, errorMessage);
        });

        ResponseDTO responseEntity = new ResponseDTO("failed", HttpStatus.BAD_REQUEST.value(), errorMapper,
                "validation failed");

        return responseEntity.makeTemplate();
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(Exception.class)
    public Map<String, Object> handleServerExceptions(Exception ex) {

        ResponseDTO responseEntity = new ResponseDTO("error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                "something went wrong");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();
    }

    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Map<String, Object> handleMethodNotAllow(HttpRequestMethodNotSupportedException ex) {

        ResponseDTO responseEntity = new ResponseDTO("error",
                HttpStatus.METHOD_NOT_ALLOWED.value(), null,
                ex.getMessage());

        log.info("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();
    }

    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public Map<String, Object> handleMediaTypeNotSupport(HttpMediaTypeNotSupportedException ex) {

        ResponseDTO responseEntity = new ResponseDTO("error",
                HttpStatus.UNSUPPORTED_MEDIA_TYPE.value(), null,
                ex.getMessage());

        log.info("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();
    }

    // handler instance has existed in database
    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(EntityAlreadyExistsException.class)
    public Map<String, Object> handleEntityAlreadyExistsException(EntityAlreadyExistsException ex) {

        ResponseDTO responseEntity = new ResponseDTO("failed", ex.getStatusCode(), null, ex.getMessage());

        return responseEntity.makeTemplate();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(EntityNotFoundException.class)
    public Map<String, Object> handleEntityNotFoundException(EntityNotFoundException ex) {

        ResponseDTO responseEntity = new ResponseDTO("failed", ex.getStatusCode(), null, ex.getMessage());

        return responseEntity.makeTemplate();
    }
}
