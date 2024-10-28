package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;

import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.PaypalTokenDTO;
import reactor.core.publisher.Mono;

public interface IPaymentService {
    public PaypalTokenDTO getPaypalAccessToken();

    public ListPaypalSignUpSellerDTO getSignUpLinks(Authentication auth);

    public UserDTO getUserSellerPaypal(String userId, String merchantId, String accountType);

    public Map<String, Object> createVaultToken();
}
