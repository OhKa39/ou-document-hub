package ohka39.oudocumenthub.backend.payload.responseWebClient;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ListPaypalSignUpSellerDTO {

    private List<PaypalSignUpSellerDTO> links;

    @Getter
    public static class PaypalSignUpSellerDTO {
        private String href;
        private String rel;
        private String method;
        private String description;
    }
}
