package ohka39.oudocumenthub.backend.services.interfaces;

import ohka39.oudocumenthub.backend.payload.DTO.CartDTO;
import ohka39.oudocumenthub.backend.payload.requests.CartRequest;

public interface ICartService {

    public CartDTO createCart(String userId, CartRequest request);

    public CartDTO getCart(String id);

    public CartDTO updateCart();
}
