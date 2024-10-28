package ohka39.oudocumenthub.backend.payload.responseWebClient;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaypalTokenDTO {
    private String scope;
    private String access_token;
    private String token_type;
    private String app_id;
    private int expired_in;
    private String nonce;

}
