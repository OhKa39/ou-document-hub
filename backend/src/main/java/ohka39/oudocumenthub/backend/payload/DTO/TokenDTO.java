package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.Data;

@Data
public class TokenDTO {
    private String userId;
    private String accessToken;
    private String refreshToken;
}
