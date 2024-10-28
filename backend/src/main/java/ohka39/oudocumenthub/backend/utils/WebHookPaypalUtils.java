package ohka39.oudocumenthub.backend.utils;

import java.io.InputStream;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.zip.CRC32;
import org.apache.commons.codec.binary.Base64;

public class WebHookPaypalUtils {
    public static long getCRC32(String payload) {
        CRC32 crc = new CRC32();
        crc.update(payload.getBytes(StandardCharsets.UTF_8));
        return crc.getValue();
    }

    public static PublicKey downloadAndCache(String certUrl) throws Exception {
        try (InputStream in = new URI(certUrl).toURL().openStream()) {
            CertificateFactory factory = CertificateFactory.getInstance("X.509");
            X509Certificate certificate = (X509Certificate) factory.generateCertificate(in);
            return certificate.getPublicKey();
        }
    }

    public static String createAssertionId(String clientId, String merchantId) {
        String header = "{\"alg\":\"none\"}";
        String payload = "{\"iss\":\"" + clientId + "\",\"payer_id\":\"" + merchantId + "\"}";
        // "{"iss":"" + clientId + "","email":"" + sellerEmail + ""}";

        byte[] encodedHeader = Base64.encodeBase64(header.getBytes());
        byte[] encodedPayload = Base64.encodeBase64(payload.getBytes());

        String jwt = new String(encodedHeader) +
                "." +
                new String(encodedPayload) +
                "."; // json web token
        return jwt;
    }
}
