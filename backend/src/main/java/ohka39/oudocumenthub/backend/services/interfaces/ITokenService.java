package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.UUID;

import ohka39.oudocumenthub.backend.payload.DTO.TokenDTO;
import ohka39.oudocumenthub.backend.payload.requests.SignInRequest;

public interface ITokenService {
  public String createVerificationToken(String userEmail);

  public TokenDTO createSignInToken(SignInRequest user);

  public TokenDTO verifyRegisterToken(String registerToken);

  public TokenDTO renewSession(String refreshToken);

  public void deleteRefreshTokenById(String id);

}
