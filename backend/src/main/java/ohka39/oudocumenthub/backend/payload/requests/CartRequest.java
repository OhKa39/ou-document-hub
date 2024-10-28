package ohka39.oudocumenthub.backend.payload.requests;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest implements Serializable {
    private List<CartItemRequest> cartItems;
}
