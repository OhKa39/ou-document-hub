package ohka39.oudocumenthub.backend.services.impl;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.SellerInformation;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.mapper.UserMapper;
import ohka39.oudocumenthub.backend.payload.responseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.PaypalSellerSignUpDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.PaypalTokenDTO;
import ohka39.oudocumenthub.backend.repositories.SellerInformationRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IPaymentService;
import ohka39.oudocumenthub.backend.utils.WebHookPaypalUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements IPaymentService {
    @Qualifier("Paypal")
    private final WebClient paypalClient;

    @Value("${PAYPAL_CLIENTID}")
    private String clientId;

    @Value("${PAYPAL_SECRETID}")
    private String clientSecret;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${PAYPAL_MERCHANT_ID}")
    private String paypalPartnerMerchantId;

    @Value("${PAYPAL_BN_CODE}")
    private String paypalBNCode;

    private final UserRepository userRepository;
    private final SellerInformationRepository sellerInformationRepository;
    private final UserMapper userMapper;

    @Override
    public PaypalTokenDTO getPaypalAccessToken() {

        // log.info("secret id: {}", clientSecret);

        String basicAuth = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        return paypalClient.post().uri("/v1/oauth2/token")
                .header("Authorization", "Basic " + basicAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .bodyValue("grant_type=client_credentials")
                .retrieve()
                .bodyToMono(PaypalTokenDTO.class)
                .block();
        // .onErrorResume(WebClientResponseException.class, ex -> {
        // // Handle any error responses.
        // return Mono.error(new RuntimeException("Error fetching token: " +
        // ex.getMessage()));
        // });
    }

    @Override
    public ListPaypalSignUpSellerDTO getSignUpLinks(Authentication auth) {
        String accessToken = getPaypalAccessToken().getAccess_token();
        String trackingId = ((User) auth.getPrincipal()).getUserId().toString();
        String requestBody = """
                    {
                        "partner_config_override": {
                            "return_url": "%s/my-account/information",
                            "return_url_description": "the url to return the merchant after the paypal onboarding process.",
                            "show_add_credit_card": true
                        },
                        "tracking_id": "%s",
                        "operations": [{
                            "operation": "API_INTEGRATION",
                            "api_integration_preference": {
                                "rest_api_integration": {
                                    "integration_method": "PAYPAL",
                                    "integration_type": "THIRD_PARTY",
                                    "third_party_details": {
                                        "features": [
                                            "PAYMENT",
                                            "REFUND"
                                        ]
                                    }
                                }
                            }
                        }],
                        "products": [
                            "EXPRESS_CHECKOUT"
                        ],
                        "legal_consents": [{
                            "type": "SHARE_DATA_CONSENT",
                            "granted": true
                        }]
                    }
                """
                .formatted(frontendUrl, trackingId);

        return paypalClient.post()
                .uri("/v2/customer/partner-referrals")
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(ListPaypalSignUpSellerDTO.class)
                .block();
    }

    @Override
    @CachePut(value = "users", key = "#userId")
    public UserDTO getUserSellerPaypal(String userId, String merchantId, String accountType) {
        User user = userRepository.findById(java.util.UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));

        String accessToken = getPaypalAccessToken().getAccess_token();
        String uri = "/v1/customer/partners/%s/merchant-integrations/%s".formatted(paypalPartnerMerchantId, merchantId);
        log.info("uri {}", uri);
        PaypalSellerSignUpDTO dto = paypalClient.get()
                .uri(uri)
                .header("Authorization", "Bearer " + accessToken)
                .header("Content-Type", "application/json")
                .retrieve()
                .bodyToMono(PaypalSellerSignUpDTO.class)
                .block();
        log.info("paypal information: {}", dto);

        if (dto.isPayments_receivable() && dto.isPrimary_email_confirmed() && dto.getOauth_integrations().size() > 0) {
            SellerInformation seller = SellerInformation.builder()
                    .accountType(accountType)
                    .isVerified(true)
                    .merchantId(merchantId)
                    .user(user)
                    .build();
            sellerInformationRepository.save(seller);
            user.setSellerInformation(seller);
            userRepository.flush();
        }
        return userMapper.toCurrentUserDTO(user);
    }

    @Override
    public Map<String, Object> createVaultToken() {
        String accessToken = getPaypalAccessToken().getAccess_token();
        String requestBody = """
                {
                  "payment_source": {
                    "card": {},
                    }
                }
                """;
        JSONObject res = paypalClient.post()
                .uri("/v3/vault/setup-tokens")
                .header("Authorization", "Bearer " + accessToken)
                .header("PayPal-Auth-Assertion",
                        WebHookPaypalUtils.createAssertionId(clientId, paypalPartnerMerchantId))
                .header("PayPal-Partner-Attribution-Id", paypalBNCode)
                .header("PayPal-Request-Id", UUID.randomUUID().toString())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JSONObject.class)
                .block();
        String token = res.getAsString("id");
        Map<String, Object> temp = new HashMap<>();
        temp.put("token", token);
        return temp;
    }

}
