package ohka39.oudocumenthub.backend.services.impl;

import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.Signature;
import java.util.Base64;
import java.util.zip.CRC32;

import org.springframework.stereotype.Service;

import ohka39.oudocumenthub.backend.services.interfaces.IPaypalWebHookService;
import ohka39.oudocumenthub.backend.utils.WebHookPaypalUtils;

@Service
public class PaypalWebHookServiceImpl implements IPaypalWebHookService {
    @Override
    public boolean verifyWebhookSignature(String payload, String signature, String transmissionId,
            String transmissionTime, String certUrl, String authAlgo, String webhookId)
            throws Exception {
        // Calculate CRC32 of event data (convert to decimal)
        long crc32Value = WebHookPaypalUtils.getCRC32(payload);
        // Construct the original message to verify
        String message = String.format("%s|%s|%s|%d", transmissionId, transmissionTime, webhookId, crc32Value);
        System.out.println("Original signed message: " + message);

        // Download and parse the PayPal certificate
        PublicKey publicKey = WebHookPaypalUtils.downloadAndCache(certUrl);

        // Convert the base64-encoded signature to a byte array
        byte[] signatureBytes = Base64.getDecoder().decode(signature);

        // Create the verifier and set it to use SHA256 with RSA
        Signature verifier = Signature.getInstance("SHA256withRSA");
        verifier.initVerify(publicKey);
        verifier.update(message.getBytes(StandardCharsets.UTF_8));

        // Verify the signature using the public key and original message
        return verifier.verify(signatureBytes);
    }

}
