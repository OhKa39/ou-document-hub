package ohka39.oudocumenthub.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.models.Cart;

public interface CartRepository extends JpaRepository<Cart, UUID> {

}
