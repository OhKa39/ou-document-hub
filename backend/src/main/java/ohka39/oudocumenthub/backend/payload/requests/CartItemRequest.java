package ohka39.oudocumenthub.backend.payload.requests;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemRequest implements Serializable {
    private String documentId;
    private int quantity;
}
