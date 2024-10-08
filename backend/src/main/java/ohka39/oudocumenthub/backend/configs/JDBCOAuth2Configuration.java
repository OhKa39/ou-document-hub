package ohka39.oudocumenthub.backend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.oauth2.client.JdbcOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class JDBCOAuth2Configuration {

    private final ClientRegistrationRepository clientRegistrationRepository;

    private final JdbcTemplate jdbcTemplate;

    @Bean
    public JdbcOAuth2AuthorizedClientService jdbcOAuth2AuthorizedClientService() {
        return new JdbcOAuth2AuthorizedClientService(jdbcTemplate, clientRegistrationRepository);
    }

}
