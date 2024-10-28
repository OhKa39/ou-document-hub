package ohka39.oudocumenthub.backend.payload.DTO;

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
public class CartDTO implements Serializable {
    List<CartItemDTO> cartItems;
}
