package ohka39.oudocumenthub.backend.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.services.interfaces.IPaypalWebHookService;

@RestController
@RequestMapping("${api-route}/webhook")
@Slf4j
@RequiredArgsConstructor
public class PaypalWebhookController {

    private final IPaypalWebHookService paypalWebHookService;

    @Value("${PAYPAL_WEBHOOKID}")
    private String webhookId;

    @PostMapping("/paypal")
    public void handlePayPalWebhook(@RequestBody String payload,
            @RequestHeader("PayPal-Transmission-Sig") String signature,
            @RequestHeader("PayPal-Transmission-Id") String transmissionId,
            @RequestHeader("PayPal-Transmission-Time") String transmissionTime,
            @RequestHeader("PayPal-Cert-Url") String certUrl,
            @RequestHeader("PayPal-Auth-Algo") String authAlgo) throws Exception {
        // Log the received payload for debugging
        log.info("Received PayPal webhook with payload: " + payload);

        boolean isValid = paypalWebHookService.verifyWebhookSignature(payload, signature, transmissionId,
                transmissionTime, certUrl, authAlgo, webhookId);

        if (isValid) {
            log.info("Valid PayPal webhook received.");
            // Handle the payload - parse JSON and handle different event types
        } else {
            log.warn("Invalid PayPal webhook received.");
        }
    }
}