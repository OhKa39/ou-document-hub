package ohka39.oudocumenthub.backend.repositories;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.models.Role;

import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID>{
    Role findByName(ERole role);
}
