package ohka39.oudocumenthub.backend.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import ohka39.oudocumenthub.backend.DTO.Request.SignUpRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @PostMapping("/sign-up")
	public ResponseEntity<?> signUp(@RequestBody @Valid SignUpRequest signUpRequeset) {
		return ResponseEntity.ok("Sign up successful");
	}
}