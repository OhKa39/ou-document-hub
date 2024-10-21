package ohka39.oudocumenthub.backend.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.models.Cart;
import ohka39.oudocumenthub.backend.models.CartItem;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.repositories.CartRepository;
import ohka39.oudocumenthub.backend.services.interfaces.ICartService;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;

    @Override
    public CartDTO getCart() {
        return null;
    }

    @Override
    public CartDTO updateCart() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateCart'");
    }

    @Override
    public CartDTO createCart(String userId, CartDTO request) {

        Optional<Cart> cart = cartRepository.findById(UUID.fromString(userId));
        if (cart.isPresent()) {

        } else {

            Cart newCart = new Cart();
            // List<CartItem> items =
        }
        return null;
    }

}
