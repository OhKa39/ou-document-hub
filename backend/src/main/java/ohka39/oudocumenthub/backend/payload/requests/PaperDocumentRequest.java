package ohka39.oudocumenthub.backend.payload.requests;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonTypeName;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonTypeName("Paper")
public class PaperDocumentRequest extends DocumentRequest {
    @NotNull(message = "Stock quantity must be greater than 0")
    @Positive(message = "Stock quantity must be greater than 0")
    private Integer stock;

    @NotEmpty(message = "You must select at least 1 shipping address")
    private List<String> shippingAddresses;
}
