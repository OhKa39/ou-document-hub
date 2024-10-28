package ohka39.oudocumenthub.backend.payload.responseWebClient;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaypalSellerSignUpDTO {
    private String merchant_id;
    private String tracking_id;
    private String legal_name;
    private String primary_email;
    private boolean primary_email_confirmed;
    private String primary_currency;
    private String country;
    private boolean payments_receivable;
    private List<OauthIntegration> oauth_integrations;

    @Getter
    public static class OauthIntegration {
        private String integration_type;
        private String integration_method;
        private List<OauthThirdParty> oauth_third_party;

        @Getter
        public static class OauthThirdParty {
            private String partner_client_id;
            private String merchant_client_id;
            private List<String> scopes;
        }
        // Getters and Setters
    }

    // Getters and Setters
}
