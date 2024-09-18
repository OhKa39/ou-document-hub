package ohka39.oudocumenthub.backend.payload.requests;

import lombok.Data;

@Data
public class RenewSessionRequest {
    private String refreshToken;
}
