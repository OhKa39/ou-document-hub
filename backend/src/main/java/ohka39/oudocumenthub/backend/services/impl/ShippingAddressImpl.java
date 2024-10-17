package ohka39.oudocumenthub.backend.services.impl;

import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.exceptions.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.ShipAddress;
import ohka39.oudocumenthub.backend.payload.DTO.ShippingAddressDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateShippingAddressRequest;
import ohka39.oudocumenthub.backend.repositories.ShippingAddressRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IShippingAddressService;

@Service
@RequiredArgsConstructor
public class ShippingAddressImpl implements IShippingAddressService {
    private final ModelMapper modelMapper;

    private final ShippingAddressRepository shippingAddressRepository;

    @Override
    public ShippingAddressDTO createShippingAddress(CreateShippingAddressRequest request) {
        Optional<ShipAddress> shippingAddress = shippingAddressRepository
                .findByAddressName(request.getShippingAddressName().toLowerCase());
        if (shippingAddress.isPresent())
            throw new EntityAlreadyExistsException("shipping address has already exists", 1005);

        ShipAddress save = ShipAddress.builder().addressName(request.getShippingAddressName().toLowerCase()).build();
        shippingAddressRepository.save(save);
        return modelMapper.map(save, ShippingAddressDTO.class);
    }

    @Override
    public Page<ShippingAddressDTO> getShippingAddresses(Pageable pageable) {
        return shippingAddressRepository.findAll(pageable).map(item -> modelMapper.map(item, ShippingAddressDTO.class));
    }

    @Override
    public ShippingAddressDTO updateShippingAddress(String id, CreateShippingAddressRequest request) {
        ShipAddress shippingAddress = shippingAddressRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("shipping address not found", 1006);
                });
        Optional<ShipAddress> isExist = shippingAddressRepository.findByAddressName(request.getShippingAddressName());
        if (isExist.isPresent())
            throw new EntityAlreadyExistsException("shipping address has already exists", 1005);
        shippingAddress.setAddressName(request.getShippingAddressName());
        shippingAddressRepository.saveAndFlush(shippingAddress);
        return modelMapper.map(shippingAddress, ShippingAddressDTO.class);
    }

    @Override
    public void deleteShippingAddress(String id) {
        ShipAddress shippingAddress = shippingAddressRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("shipping address not found", 1004);
                });
        shippingAddressRepository.delete(shippingAddress);
    }
}
