package ohka39.oudocumenthub.backend.payload.requests;

import lombok.Data;

@Data
public class SignInRequest {
    private String email;
    private String password;
}
