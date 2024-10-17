package ohka39.oudocumenthub.backend.payload.requests;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonTypeName;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonTypeName("Online")
public class OnlineDocumentRequest extends DocumentRequest {
    // @NotNull(message = "The document file cannot be empty and must be less than
    // 50 MB")
    // @Size(max = 50000000, message = "The document file must be less than 50 MB")
    private MultipartFile onlineFile;
}
