package ohka39.oudocumenthub.backend.services.interfaces;

import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;

public interface ICartService {

    public CartDTO createCart(String userId, CartDTO request);

    public CartDTO getCart();

    public CartDTO updateCart();
}
