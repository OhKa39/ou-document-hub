package ohka39.oudocumenthub.backend.components;

import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEvent;

import lombok.Getter;
import lombok.Setter;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;

@Setter
@Getter
public class OnConfirmationRegisterEvent extends ApplicationEvent{
  private UserResponse user;
  private String appUrl;

  public OnConfirmationRegisterEvent(UserResponse user, String appUrl){
    super(user);
    this.user = user;
    this.appUrl = appUrl;
  }
}
