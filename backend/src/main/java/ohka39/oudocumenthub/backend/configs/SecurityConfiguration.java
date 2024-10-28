package ohka39.oudocumenthub.backend.configs;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.JdbcOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.util.matcher.RequestHeaderRequestMatcher;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.components.CustomOauth2LoginSuccessHandler;
import ohka39.oudocumenthub.backend.components.JWTtoUserConvertor;
import ohka39.oudocumenthub.backend.components.KeyUtils;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfiguration {

        private final String[] WHITE_LIST = {
                        "/api/v1/auth/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/login/**",
                        "/oauth2/**",
                        "/actuator/health/**",
                        "/api/v1/webhook/paypal",
        };

        private final String[] GUEST_WHITE_LIST = {
                        "/api/v1/documents/{id}",
                        "/api/v1/documents/url/{shortUrl}",
                        "/api/v1/documents",
        };

        @Value("${frontend.url}")
        private String frontendUrl;

        private final JWTtoUserConvertor jwtToUserConverter;

        private final KeyUtils keyUtils;

        private final UserDetailsManager userDetailsManager;

        private final PasswordEncoder passwordEncoder;

        private final CustomOauth2LoginSuccessHandler customOauth2LoginSuccessHandler;

        private final JdbcOAuth2AuthorizedClientService jdbcOAuth2AuthorizedClientService;

        @Bean
        @Order(1)
        public SecurityFilterChain resourceServerFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(AbstractHttpConfigurer::disable)
                                .securityMatcher(new RequestHeaderRequestMatcher("Authorization"))
                                .authorizeHttpRequests((authorize) -> authorize
                                                .requestMatchers(WHITE_LIST).permitAll()
                                                .requestMatchers(HttpMethod.GET, GUEST_WHITE_LIST).permitAll()
                                                .anyRequest().authenticated())
                                .oauth2ResourceServer(
                                                (oauth2) -> oauth2.jwt((jwt) -> jwt
                                                                .jwtAuthenticationConverter(jwtToUserConverter)))
                                .sessionManagement((session) -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

                return http.build();
        }

        @Bean
        @Order(2)
        public SecurityFilterChain clientFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(AbstractHttpConfigurer::disable)
                                .authorizeHttpRequests((authorize) -> authorize
                                                .requestMatchers(WHITE_LIST).permitAll()
                                                .requestMatchers(HttpMethod.GET, GUEST_WHITE_LIST).permitAll()
                                                .anyRequest().authenticated())
                                .oauth2Login((oauth2) -> oauth2.successHandler(customOauth2LoginSuccessHandler)
                                                .authorizedClientService(jdbcOAuth2AuthorizedClientService))
                                // .oauth2Client(Customizer.withDefaults())
                                .exceptionHandling(handler -> handler
                                                .authenticationEntryPoint(
                                                                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));

                return http.build();
        }

        @Bean
        @Primary
        JwtDecoder jwtAccessTokenDecoder() {
                return NimbusJwtDecoder.withPublicKey(keyUtils.getAccessTokenPublicKey()).build();
        }

        @Bean
        @Primary
        JwtEncoder jwtAccessTokenEncoder() {
                JWK jwk = new RSAKey.Builder(keyUtils.getAccessTokenPublicKey())
                                .privateKey(keyUtils.getAccessTokenPrivateKey())
                                .build();
                JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
                return new NimbusJwtEncoder(jwks);
        }

        @Bean
        @Qualifier("jwtRefreshTokenDecoder")
        JwtDecoder jwtRefreshTokenDecoder() {
                return NimbusJwtDecoder.withPublicKey(keyUtils.getRefreshTokenPublicKey()).build();
        }

        @Bean
        @Qualifier("jwtRefreshTokenEncoder")
        JwtEncoder jwtRefreshTokenEncoder() {
                JWK jwk = new RSAKey.Builder(keyUtils.getRefreshTokenPublicKey())
                                .privateKey(keyUtils.getRefreshTokenPrivateKey())
                                .build();
                JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
                return new NimbusJwtEncoder(jwks);
        }

        @Bean
        @Qualifier("jwtRefreshTokenAuthProvider")
        JwtAuthenticationProvider jwtRefreshTokenAuthProvider() {
                JwtAuthenticationProvider provider = new JwtAuthenticationProvider(jwtRefreshTokenDecoder());
                provider.setJwtAuthenticationConverter(jwtToUserConverter);
                return provider;
        }

        @Bean
        DaoAuthenticationProvider daoAuthenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
                provider.setPasswordEncoder(passwordEncoder);
                provider.setUserDetailsService(userDetailsManager);
                return provider;
        }
}
