package ohka39.oudocumenthub.backend.payload.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateVaultTokenRequest {
    private String name;
}
