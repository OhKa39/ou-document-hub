
package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CartItemDTO implements Serializable {
    private String itemId;
    private int quantity;

    private DocumentDTO document;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
