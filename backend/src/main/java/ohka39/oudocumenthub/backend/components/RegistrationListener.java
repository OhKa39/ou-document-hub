package ohka39.oudocumenthub.backend.components;

import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.events.OnConfirmationRegisterEvent;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.services.ITokenService;
import ohka39.oudocumenthub.backend.services.IUserService;

@Component
@RequiredArgsConstructor
public class RegistrationListener implements ApplicationListener<OnConfirmationRegisterEvent> {

    private final JavaMailSender mailSender;

    private final ITokenService tokenService;

    @Override
    @Async
    public void onApplicationEvent(OnConfirmationRegisterEvent event) {
        this.confirmationRegister(event);
    }

    private void confirmationRegister(OnConfirmationRegisterEvent event) {
        UserDTO user = event.getUser();
        String verifyToken = tokenService.createVerificationToken(user.getEmail());

        String recipientAddress = user.getEmail();
        String subject = "Xác nhận đăng ký tài khoản OU Document Hub";
        String confirmationUrl = event.getAppUrl() + "/verify-token?register_token=" + verifyToken;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText("Hãy nhấn vào đây để xác nhận đăng ký tài khoản OUDocumentHub: " + confirmationUrl);
        mailSender.send(email);
    }
}
