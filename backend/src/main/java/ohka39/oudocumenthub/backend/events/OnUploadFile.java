package ohka39.oudocumenthub.backend.events;

import org.springframework.context.ApplicationEvent;
import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OnUploadFile extends ApplicationEvent {
    private String key;
    private MultipartFile file;

    public OnUploadFile(String key, MultipartFile file) {
        super(key);
        this.key = key;
        this.file = file;
    }
}
