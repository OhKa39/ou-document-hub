package ohka39.oudocumenthub.backend.payload.mapper;

import org.modelmapper.ModelMapper;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.models.Cart;
import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;

@RequiredArgsConstructor
public class CartMapper {
    private final ModelMapper modelMapper;

    public CartDTO toCartDTO(Cart cart) {
        return null;
    }

    public Cart toCart(CartDTO cartDTO) {
        return null;
    }
}
