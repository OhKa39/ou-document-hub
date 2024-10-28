
package ohka39.oudocumenthub.backend.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.shaded.gson.JsonObject;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.responseWebClient.PaypalTokenDTO;
import ohka39.oudocumenthub.backend.services.interfaces.IPaymentService;

@RestController
@RequestMapping("/${api-route}/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final IPaymentService paymentService;

    @GetMapping("/token")
    public ResponseEntity<ResponseDTO> getAuthorizationToken() {
        PaypalTokenDTO paypalResponse = paymentService.getPaypalAccessToken();
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), paypalResponse,
                "get paypal authorization token successfully");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/customer/partner-referrals")
    public ResponseEntity<ResponseDTO> getUrlRedirectSignUp(Authentication auth) {

        ListPaypalSignUpSellerDTO paypalResponse = paymentService.getSignUpLinks(auth);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), paypalResponse,
                "get paypal signup link successfully");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/customer/seller-onboard-status")
    public ResponseEntity<ResponseDTO> getSellerOnboardStatus(@RequestParam("user_id") String userId,
            @RequestParam("merchant_id") String merchantId, @RequestParam("account_type") String accountType) {

        UserDTO paypalResponse = paymentService.getUserSellerPaypal(userId, merchantId, accountType);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(),
                paypalResponse,
                "get seller onboard status successfully");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/vault/setup-tokens")
    public ResponseEntity<ResponseDTO> getVaultToken() {

        Map<String, Object> paypalResponse = paymentService.createVaultToken();
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(),
                paypalResponse,
                "get paypal setup token successfully");
        return ResponseEntity.ok().body(response);
    }
}