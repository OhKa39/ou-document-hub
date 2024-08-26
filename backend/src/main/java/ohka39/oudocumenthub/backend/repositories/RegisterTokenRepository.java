package ohka39.oudocumenthub.backend.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.RegisterToken;

@Repository
public interface RegisterTokenRepository extends CrudRepository<RegisterToken, String> {
    Optional<RegisterToken> findById(String id);
}
