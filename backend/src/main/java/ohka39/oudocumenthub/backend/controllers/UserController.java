package ohka39.oudocumenthub.backend.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.IUserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/user")
@Slf4j
public class UserController {

    private final IUserService userService;

    @GetMapping
    public ResponseEntity<ResponseDTO> getCurrentUser(Authentication auth) {
        UserDTO userResponse = auth.getPrincipal() instanceof DefaultOAuth2User
                ? userService.getUserById(((DefaultOAuth2User) auth.getPrincipal()).getName())
                : userService
                        .getUserById(((User) auth.getPrincipal()).getUserId().toString());
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), userResponse,
                "retrieve user successfully");
        return ResponseEntity.ok().body(response);
    }
}
