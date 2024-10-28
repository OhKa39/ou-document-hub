package ohka39.oudocumenthub.backend.payload.mapper;

import java.util.List;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.models.Cart;
import ohka39.oudocumenthub.backend.models.CartItem;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.payload.DTO.CartItemDTO;

@RequiredArgsConstructor
@Component
public class CartMapper {
    // private final ModelMapper modelMapper;

    private final DocumentMapper documentMapper;

    public CartDTO toCartDTO(Cart cart) {
        List<CartItemDTO> items = cart.getCartItems().stream().map(item -> {
            CartItemDTO temp = new CartItemDTO(item.getItemId().toString(), item.getQuantity(),
                    documentMapper.toDocumentDTO(item.getDocument()), item.getCreatedAt(), item.getUpdatedAt());
            return temp;
        }).toList();
        CartDTO cartDTO = new CartDTO(items);
        return cartDTO;
    }

    // public Cart toCart(Cart existCart, CartDTO cartDTO) {
    // List<CartItem> cartItems = cartDTO.getCartItems().stream().map(item -> {
    // return
    // CartItem.builder().cart(existCart).itemId(UUID.fromString(item.getItemId())).build();
    // }).toList();
    // existCart.setCartItems(cartItems);
    // return existCart;
    // }
}
