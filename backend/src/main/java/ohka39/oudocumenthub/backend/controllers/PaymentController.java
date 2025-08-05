package ohka39.oudocumenthub.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.OrderDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.ListPaypalSignUpSellerDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalCaptureOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalOrderDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalTokenDTO;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.PaypalVaultTokenDTO;
import ohka39.oudocumenthub.backend.services.interfaces.IPaymentService;

@RestController
@RequestMapping("/${api-route}/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final IPaymentService paymentService;

    @GetMapping("/token")
    public ResponseEntity<ResponseDTO> getAuthorizationToken() {
        try {
            PaypalTokenDTO paypalResponse = paymentService.getPaypalAccessToken();
            ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), paypalResponse,
                    "get paypal authorization token successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to get PayPal authorization token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/save-order")
    public ResponseEntity<ResponseDTO> saveOrder(
            @RequestParam("user_id") String userId,
            @RequestParam("status") String status,
            @RequestParam("payment_method") String paymentMethod,
            @RequestParam(value = "first_name", required = false) String firstName,
            @RequestParam(value = "last_name", required = false) String lastName,
            @RequestParam(value = "phone_number", required = false) String phoneNumber,
            @RequestParam(value = "email", required = false) String email) {
        OrderDTO saveOrderRes = paymentService.saveOrder(userId, status, paymentMethod, firstName, lastName,
                phoneNumber, email);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(),
                saveOrderRes,
                "create order successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/customer/partner-referrals")
    public ResponseEntity<ResponseDTO> getUrlRedirectSignUp(Authentication auth) {
        try {
            ListPaypalSignUpSellerDTO paypalResponse = paymentService.getSignUpLinks(auth);
            ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), paypalResponse,
                    "get paypal signup link successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to get PayPal signup link: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/customer/seller-onboard-status")
    public ResponseEntity<ResponseDTO> getSellerOnboardStatus(@RequestParam("user_id") String userId,
            @RequestParam("merchant_id") String merchantId,
            @RequestParam("account_type") String accountType) {
        try {
            log.info("user_id: {}, merchant_id: {}, account_type: {}", userId, merchantId, accountType);
            UserDTO paypalResponse = paymentService.getUserSellerPaypal(userId, merchantId, accountType);
            ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(),
                    paypalResponse,
                    "get seller onboard status successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to get seller onboard status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/vault/setup-tokens")
    public ResponseEntity<ResponseDTO> getVaultToken() {
        try {
            PaypalVaultTokenDTO paypalResponse = paymentService.createVaultToken();
            ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(),
                    paypalResponse,
                    "get paypal setup token successfully");
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to get PayPal setup token: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/checkout/orders")
    public ResponseEntity<ResponseDTO> checkoutOrders(Authentication auth) {
        try {
            String userId = !(auth.getPrincipal() instanceof DefaultOAuth2User)
                    ? ((User) auth.getPrincipal()).getUserId().toString()
                    : ((DefaultOAuth2User) auth.getPrincipal()).getName();

            PaypalOrderDTO paypalResponse = paymentService.createOrders(userId);
            ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(),
                    paypalResponse,
                    "create order successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/checkout/orders/{orderId}/capture")
    public ResponseEntity<ResponseDTO> captureOrder(@PathVariable String orderId) {
        try {
            OrderDTO paypalResponse = paymentService.captureOrder(orderId);
            log.info("paypal capture: {}", paypalResponse);
            ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(),
                    paypalResponse,
                    "capture order successfully");
            log.info("response capture: {}", response.toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            ResponseDTO response = new ResponseDTO("error", HttpStatus.INTERNAL_SERVER_ERROR.value(), null,
                    "Failed to capture order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
