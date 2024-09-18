package ohka39.oudocumenthub.backend.repositories;

import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.RefreshToken;

import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
}
