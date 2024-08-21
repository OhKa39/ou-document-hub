package ohka39.oudocumenthub.backend.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignUpRequest {
    
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "gender is required")
    private String gender;

    @NotBlank(message = "password is required")
    private String password;

    @NotBlank(message = "first name is required")
    private String firstName;


    @NotBlank(message = "last name is required")
    private String lastName;
}
