package ohka39.oudocumenthub.backend.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class CorsConfiguration implements WebMvcConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        log.info("Setting CORS allowed origin in corsconfig: {}", frontendUrl); // debug

        registry.addMapping("/**") // Allow CORS on all paths
                .allowedOrigins(frontendUrl) // Allowed
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
                .allowedHeaders("*") // Allowed headers
                .allowCredentials(true) // Allow credentials (e.g., cookies)
                .maxAge(3600); // Time the response from a pre-flight request can be cached by clients
    }
}
