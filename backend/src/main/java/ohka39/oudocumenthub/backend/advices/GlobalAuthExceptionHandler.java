package ohka39.oudocumenthub.backend.advices;

import java.nio.file.AccessDeniedException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.web.authentication.www.NonceExpiredException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;

@RestControllerAdvice
@Slf4j
public class GlobalAuthExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.UNAUTHORIZED.value(), null,
                "invalid username or password");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleUsernameNotFoundException(UsernameNotFoundException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.NOT_FOUND.value(), null,
                "user not found");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(DisabledException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, Object> handleDisabledException(DisabledException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.FORBIDDEN.value(), null,
                "user account is not enable");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(InvalidBearerTokenException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleDisabledException(InvalidBearerTokenException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.UNAUTHORIZED.value(), null,
                "token is not valid");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(LockedException.class)
    @ResponseStatus(HttpStatus.LOCKED)
    public Map<String, Object> handleLockedException(LockedException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.LOCKED.value(), null,
                "user account is locked");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(NonceExpiredException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleNonceExpiredException(NonceExpiredException ex, WebRequest request) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.UNAUTHORIZED.value(), null,
                "session has expired, please log in again");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public Map<String, Object> handleNonceExpiredException(AccessDeniedException ex) {
        ResponseDTO responseEntity = new ResponseDTO("failed",
                HttpStatus.UNAUTHORIZED.value(), null,
                "you haven't authorize for this action");

        log.error("error show stack: {}", ex.getMessage());

        return responseEntity.makeTemplate();

    }

}
