package ohka39.oudocumenthub.backend.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.models.ShipAddress;

public interface ShippingAddressRepository extends JpaRepository<ShipAddress, UUID> {
    Optional<ShipAddress> findByAddressName(String name);
}
