package ohka39.oudocumenthub.backend.payload.ResponseWebClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaypalExceptionDTO {
    private String name;
    private Detail details;
    private String message;
    private String debug_id;

    @Getter
    public static class Detail {
        private String issue;
        private String description;
    }
}
