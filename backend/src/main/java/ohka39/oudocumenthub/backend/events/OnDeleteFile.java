package ohka39.oudocumenthub.backend.events;

import org.springframework.context.ApplicationEvent;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OnDeleteFile extends ApplicationEvent {
    private String key;

    public OnDeleteFile(String key) {
        super(key);
        this.key = key;
    }

}
