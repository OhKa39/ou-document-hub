package ohka39.oudocumenthub.backend.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.components.OnConfirmationRegisterEvent;
import ohka39.oudocumenthub.backend.payload.requests.UserRequest;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;
import ohka39.oudocumenthub.backend.services.IUserService;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {

	private final ApplicationEventPublisher eventPublisher;

	private final IUserService userService;

	@Value("${frontendUrl}")
	private String frontendUrl;

	@PostMapping("/sign-up")
	public ResponseEntity<Object> signUp(@RequestBody @Valid UserRequest user) {
		UserResponse registered = userService.registerNewUserAccount(user);

		eventPublisher.publishEvent(new OnConfirmationRegisterEvent(registered, frontendUrl));

		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("data", registered);
		response.put("message", "create user successfully");

		return ResponseEntity.ok(response);
	}
}