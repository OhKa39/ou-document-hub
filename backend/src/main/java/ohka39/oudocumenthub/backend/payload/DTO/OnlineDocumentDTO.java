package ohka39.oudocumenthub.backend.payload.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OnlineDocumentDTO extends DocumentDTO {
    private String onlineFile;
    private String fileType;
}
