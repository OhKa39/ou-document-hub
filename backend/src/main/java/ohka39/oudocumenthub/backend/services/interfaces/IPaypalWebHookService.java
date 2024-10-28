package ohka39.oudocumenthub.backend.services.interfaces;

import java.security.NoSuchAlgorithmException;

public interface IPaypalWebHookService {
    public boolean verifyWebhookSignature(String payload, String signature, String transmissionId,
            String transmissionTime, String certUrl, String authAlgo,
            String webhookId) throws Exception;
}
