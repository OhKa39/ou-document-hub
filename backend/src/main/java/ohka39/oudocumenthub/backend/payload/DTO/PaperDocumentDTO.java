package ohka39.oudocumenthub.backend.payload.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaperDocumentDTO extends DocumentDTO {
    private int stock;
    private List<String> shipAddresses;
}
