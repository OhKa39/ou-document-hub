package ohka39.oudocumenthub.backend.payload.ResponseWebClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeRateDTO {
    private Double conversion_rate;
}
