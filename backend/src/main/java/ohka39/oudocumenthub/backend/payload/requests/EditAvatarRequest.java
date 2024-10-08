package ohka39.oudocumenthub.backend.payload.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@AllArgsConstructor
public class EditAvatarRequest {
    MultipartFile file;
}
