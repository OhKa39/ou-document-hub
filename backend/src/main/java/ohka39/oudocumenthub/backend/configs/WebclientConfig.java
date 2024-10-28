package ohka39.oudocumenthub.backend.configs;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.NoArgsConstructor;

@Configuration
@NoArgsConstructor
public class WebclientConfig {
    @Bean
    @Qualifier("Paypal")
    public WebClient getWebclientPaypal() {
        return WebClient.create("https://api-m.sandbox.paypal.com");
    }

    @Bean
    @Qualifier("GooglePeopleApis")
    public WebClient getWebclientGooglePeople() {
        return WebClient.create("https://people.googleapis.com");
    }
}
