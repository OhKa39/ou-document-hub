package ohka39.oudocumenthub.backend.services.impl;

import java.text.MessageFormat;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.components.TokenGenerator;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.RefreshToken;
import ohka39.oudocumenthub.backend.models.RegisterToken;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.TokenDTO;
import ohka39.oudocumenthub.backend.payload.requests.SignInRequest;
import ohka39.oudocumenthub.backend.repositories.RefreshTokenRepository;
import ohka39.oudocumenthub.backend.repositories.RegisterTokenRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.ITokenService;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenServiceImpl implements ITokenService {
    private final RegisterTokenRepository registerTokenRepository;

    private final RefreshTokenRepository refreshTokenRepository;

    private final TokenGenerator tokenGenerator;

    private final UserRepository userRepository;

    private final DaoAuthenticationProvider daoAuthenticationProvider;

    @Qualifier("jwtRefreshTokenAuthProvider")
    private final JwtAuthenticationProvider refreshTokenAuthProvider;

    @Override
    public String createVerificationToken(String userEmail) {
        RegisterToken tokenInstance = new RegisterToken();
        tokenInstance.setEmail(userEmail);
        tokenInstance.setRegisterTokenId(UUID.randomUUID().toString());
        return registerTokenRepository.save(tokenInstance).getRegisterTokenId();
    }

    @Override
    public TokenDTO createSignInToken(SignInRequest user) {
        Authentication authentication = daoAuthenticationProvider.authenticate(
                UsernamePasswordAuthenticationToken
                        .unauthenticated(user.getEmail(), user.getPassword()));

        log.debug("authentication: {}", authentication);
        TokenDTO token = tokenGenerator.createToken(authentication);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(token.getUserId());
        refreshToken.setRefreshToken(token.getRefreshToken());
        refreshTokenRepository.save(refreshToken);

        return token;
    }

    @Override
    public TokenDTO verifyRegisterToken(String registerToken) {
        Optional<RegisterToken> token = registerTokenRepository.findByRegisterTokenId(registerToken);

        log.info("register: {}", registerToken);
        if (token.isEmpty())
            throw new EntityNotFoundException("register token is expired or have not registered", 2000);

        Optional<User> userInstance = userRepository.findByEmail(token.get().getEmail());

        if (userInstance.isEmpty())
            throw new EntityNotFoundException("can not found user register with this token", 1000);

        registerTokenRepository.deleteByRegisterTokenId(registerToken);
        userInstance.get().setEnable(true);
        User savedUser = userRepository.save(userInstance.get());

        Authentication auth = UsernamePasswordAuthenticationToken.authenticated(
                savedUser, null, savedUser.getAuthorities());

        TokenDTO userToken = tokenGenerator.createToken(auth);
        return userToken;
    }

    @Override
    public TokenDTO renewSession(String refreshToken) {
        Authentication validRefreshToken = refreshTokenAuthProvider
                .authenticate(new BearerTokenAuthenticationToken(refreshToken));
        Jwt jwt = (Jwt) validRefreshToken.getCredentials();
        Optional<RefreshToken> token = refreshTokenRepository.findByRefreshToken(jwt.getTokenValue());

        if (token.isEmpty())
            throw new EntityNotFoundException("refresh token does not exist", 2001);

        TokenDTO newToken = tokenGenerator.createToken(validRefreshToken);

        token.get().setRefreshToken(newToken.getRefreshToken());
        return newToken;
    }

    @Override
    public void deleteRefreshTokenById(String id) {
        refreshTokenRepository.deleteById(id);
    }
}
