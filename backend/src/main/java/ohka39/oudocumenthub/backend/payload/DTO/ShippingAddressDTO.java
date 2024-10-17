package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShippingAddressDTO implements Serializable {
    private String addressId;
    private String addressName;
}
