package ohka39.oudocumenthub.backend.payload.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateShippingAddressRequest {
    @NotBlank(message = "shipping address is required")
    @Size(min = 1, max = 100, message = "shipping address must in range 1 - 100 characters ")
    private String shippingAddressName;
}
