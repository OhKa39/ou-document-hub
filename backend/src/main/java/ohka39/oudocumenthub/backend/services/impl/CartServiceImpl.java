package ohka39.oudocumenthub.backend.services.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Cart;
import ohka39.oudocumenthub.backend.models.CartItem;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.payload.mapper.CartMapper;
import ohka39.oudocumenthub.backend.payload.requests.CartRequest;
import ohka39.oudocumenthub.backend.repositories.CartItemRepository;
import ohka39.oudocumenthub.backend.repositories.CartRepository;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.ICartService;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {

    private final CartRepository cartRepository;

    private final UserRepository userRepository;

    private final DocumentRepository documentRepository;

    private final CartItemRepository cartItemRepository;

    private final CartMapper cartMapper;

    @Override
    @Cacheable(value = "cart", key = "#id")
    public CartDTO getCart(String id) {
        Cart cart = cartRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("Can not found cart", 1008));
        return cartMapper.toCartDTO(cart);
    }

    @Override
    public CartDTO updateCart() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateCart'");
    }

    @Override
    @CachePut(value = "cart", key = "#userId")
    public CartDTO createCart(String userId, CartRequest request) {

        Cart cart = cartRepository.findById(UUID.fromString(userId)).orElseGet(() -> {
            Cart newCart = new Cart();

            User user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));
            newCart.setUser(user);
            return newCart;
        });

        Set<Document> docs = documentRepository.findAllById(
                request.getCartItems().stream().map(item -> UUID.fromString(item.getDocumentId())).toList())
                .stream().collect(Collectors.toSet());

        // Remove old CartItems directly from the collection, if necessary
        if (cart.getCartItems() != null && !cart.getCartItems().isEmpty()) {
            cart.getCartItems().clear();
        }

        Set<CartItem> items = new HashSet<>();
        int index = 0;
        for (Document doc : docs) {
            CartItem temp = CartItem.builder()
                    .cart(cart)
                    .document(doc)
                    .quantity(request.getCartItems().get(index).getQuantity())
                    .build();
            // doc.getCartItems().add(temp);
            cartItemRepository.save(temp);
            items.add(temp);
            ++index;
        }

        // Update the cart's items (replace the old list)
        cart.getCartItems().addAll(items);

        // Save the Cart and flush once
        cartRepository.saveAndFlush(cart);

        return cartMapper.toCartDTO(cart);

    }

}
