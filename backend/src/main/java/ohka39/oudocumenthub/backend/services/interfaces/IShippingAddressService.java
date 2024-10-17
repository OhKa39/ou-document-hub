package ohka39.oudocumenthub.backend.services.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import ohka39.oudocumenthub.backend.payload.DTO.ShippingAddressDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateShippingAddressRequest;

public interface IShippingAddressService {
    public ShippingAddressDTO createShippingAddress(CreateShippingAddressRequest request);

    public Page<ShippingAddressDTO> getShippingAddresses(Pageable pageable);

    public ShippingAddressDTO updateShippingAddress(String id, CreateShippingAddressRequest request);

    public void deleteShippingAddress(String id);
}
