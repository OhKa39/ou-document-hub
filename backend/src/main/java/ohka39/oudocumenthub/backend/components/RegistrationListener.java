package ohka39.oudocumenthub.backend.components;

import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;
import ohka39.oudocumenthub.backend.services.IUserService;

@Component
@RequiredArgsConstructor
public class RegistrationListener implements ApplicationListener<OnConfirmationRegisterEvent>{

    private final JavaMailSender mailSender;

    private final IUserService userService;

    @Override
    @Async
    public void onApplicationEvent(OnConfirmationRegisterEvent event){
        this.confirmationRegister(event);
    }

    private void confirmationRegister(OnConfirmationRegisterEvent event) {
        UserResponse user = event.getUser();
        String verifyToken = userService.createVerificationToken(user.getEmail());
        
        String recipientAddress = user.getEmail();
        String subject = "Xác nhận đăng ký tài khoản OU Document Hub";
        String confirmationUrl 
          = event.getAppUrl() + "/registration-confirmation?token=" + verifyToken;
        
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText("Hãy nhấn vào đây để xác nhận đăng ký: " + confirmationUrl);
        mailSender.send(email);
    }
}
