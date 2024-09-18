package ohka39.oudocumenthub.backend.events;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;

import lombok.Getter;
import lombok.Setter;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;

@Setter
@Getter
public class OnConfirmationRegisterEvent extends ApplicationEvent {
    private UserDTO user;
    private String appUrl;

    public OnConfirmationRegisterEvent(UserDTO user, String appUrl) {
        super(user);
        this.user = user;
        this.appUrl = appUrl;
    }
}
