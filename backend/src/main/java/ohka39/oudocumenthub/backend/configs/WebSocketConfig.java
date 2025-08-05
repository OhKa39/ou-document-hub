package ohka39.oudocumenthub.backend.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("Setting CORS allowed origin for websocket: {}", frontendUrl);
        registry.addEndpoint("/chat-websocket")
                .setAllowedOrigins(frontendUrl)
                .withSockJS();
        registry.addEndpoint("/comments")
                .setAllowedOrigins(frontendUrl)
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    // @Override
    // public void configureClientInboundChannel(ChannelRegistration registration) {
    // registration.interceptors(new ChannelInterceptor() {
    // @Override
    // public Message<?> preSend(Message<?> message, MessageChannel channel) {
    // StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
    // if (StompCommand.CONNECT.equals(accessor.getCommand())) {
    // String authHeader = accessor.getFirstNativeHeader("Authorization");
    // if (authHeader != null && authHeader.startsWith("Bearer ")) {
    // String token = authHeader.substring(7);
    // try {
    // // Decode and validate JWT
    // jwtAccessTokenDecoder.decode(token);
    // // Set authentication in SecurityContext (optional, depending on your needs)
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // if (authentication == null || !authentication.isAuthenticated()) {
    // // You can create an Authentication object if needed
    // log.info("Authenticated WebSocket connection with JWT");
    // }
    // } catch (JwtException e) {
    // log.error("Invalid JWT token: {}", e.getMessage());
    // throw new SecurityException("Invalid JWT token");
    // }
    // } else {
    // log.error("Missing or invalid Authorization header");
    // throw new SecurityException("Missing or invalid Authorization header");
    // }
    // }
    // return message;
    // }
    // });
    // }
}
