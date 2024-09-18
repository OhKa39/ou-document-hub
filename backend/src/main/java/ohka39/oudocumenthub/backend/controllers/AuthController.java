package ohka39.oudocumenthub.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.events.OnConfirmationRegisterEvent;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.DTO.TokenDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.requests.RenewSessionRequest;
import ohka39.oudocumenthub.backend.payload.requests.SignInRequest;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;
import ohka39.oudocumenthub.backend.services.ITokenService;
import ohka39.oudocumenthub.backend.services.IUserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/auth")
@Slf4j
public class AuthController {

    private final ApplicationEventPublisher eventPublisher;

    private final IUserService userService;

    private final ITokenService tokenService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @PostMapping("/sign-up")
    public ResponseEntity<ResponseDTO> signUp(@RequestBody @Valid SignUpRequest user) {
        UserDTO registered = userService.registerNewUserAccount(user);

        eventPublisher.publishEvent(new OnConfirmationRegisterEvent(registered, frontendUrl));

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.CREATED.value(), registered,
                "create user successfully");

        return ResponseEntity.status(HttpStatus.CREATED).body(responseEntity);
    }

    @GetMapping("/verify-register-token")
    public ResponseEntity<ResponseDTO> verifyRegisterToken(@RequestParam String registerToken) {
        TokenDTO token = tokenService.verifyRegisterToken(registerToken);

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.OK.value(), token,
                "verify user successfully");

        return ResponseEntity.status(HttpStatus.OK).body(responseEntity);

    }

    @GetMapping("/renew-register-token")
    public ResponseEntity<ResponseDTO> renewRegisterToken(@RequestParam String id) {
        UserDTO user = userService.getUserById(id);
        eventPublisher.publishEvent(new OnConfirmationRegisterEvent(user, frontendUrl));

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.OK.value(), null,
                "renew register token successfully");

        return ResponseEntity.status(HttpStatus.OK).body(responseEntity);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<ResponseDTO> signIn(@RequestBody SignInRequest user) {

        TokenDTO token = tokenService.createSignInToken(user);

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.OK.value(), token,
                "user authenticated successfully");

        return ResponseEntity.status(HttpStatus.OK).body(responseEntity);

    }

    @PostMapping("/renew-session")
    public ResponseEntity<ResponseDTO> regenerateAccessToken(@RequestBody RenewSessionRequest refreshToken) {

        TokenDTO token = tokenService.renewSession(refreshToken.getRefreshToken());

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.OK.value(), token,
                "renew session successfully");
        return ResponseEntity.status(HttpStatus.OK).body(responseEntity);
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie[] cookies = request.getCookies();

        if (cookies != null)
            for (Cookie cookie : cookies) {
                log.info("cookie {}", cookie);
                if (cookie.getName() == "refreshToken")
                    tokenService.deleteRefreshTokenById(cookie.getValue());
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        SecurityContextHolder.clearContext();

        ResponseDTO responseEntity = new ResponseDTO("success", HttpStatus.OK.value(), null,
                "delete session successfully");
        return ResponseEntity.status(HttpStatus.OK).body(responseEntity);
    }
}