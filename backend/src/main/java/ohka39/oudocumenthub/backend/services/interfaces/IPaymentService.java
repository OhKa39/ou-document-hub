package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;

import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalTokenDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalVaultTokenDTO;
import ohka39.oudocumenthub.backend.payload.requests.CartRequest;
import reactor.core.publisher.Mono;

public interface IPaymentService {
    public PaypalTokenDTO getPaypalAccessToken();

    public ListPaypalSignUpSellerDTO getSignUpLinks(Authentication auth);

    public UserDTO getUserSellerPaypal(String userId, String merchantId, String accountType);

    public PaypalVaultTokenDTO createVaultToken();

    public PaypalOrderDTO createOrders(String userId);

    public PaypalCaptureOrderDTO captureOrder(String orderId);
}
