package ohka39.oudocumenthub.backend.controllers;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import ohka39.oudocumenthub.backend.enums.EGender;
import ohka39.oudocumenthub.backend.payload.requests.UserRequest;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;
import ohka39.oudocumenthub.backend.services.IUserService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private IUserService userService;

        @MockBean
        private ApplicationEventPublisher eventPublisher;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        public void testSignUpSuccessfully() throws Exception {
                // Mock user request
                UserRequest userRequest = UserRequest.builder()
                                .email("test@example.com")
                                .firstName("Test")
                                .lastName("User")
                                .password("12303123aBc@")
                                .gender(EGender.Male)
                                .dateOfBirth(LocalDate.of(1990, 1, 1))
                                .build();

                // Mock user response
                UserResponse userResponse = UserResponse.builder()
                                .email("test@example.com")
                                .firstName("Test")
                                .gender(EGender.Male)
                                .dateOfBirth(LocalDate.of(1990, 1, 1))
                                .createdAt(LocalDateTime.now())
                                .lastName("User")
                                .build();

                // Mock service behavior
                when(userService.registerNewUserAccount(userRequest)).thenReturn(userResponse);

                // Perform POST request
                mockMvc.perform(post("/api/v1/auth/sign-up")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(userRequest)))
                                .andExpect(status().isOk());

        }

        @Test
        public void testSignUpFailWithWrongEmailFormat() throws Exception {
                // Mock user request
                UserRequest userRequest = UserRequest.builder()
                                .email("testexample.com")
                                .firstName("Test")
                                .lastName("User")
                                .password("12303123aBc@")
                                .gender(EGender.Male)
                                .dateOfBirth(LocalDate.of(1990, 1, 1))
                                .build();

                // Perform POST request
                mockMvc.perform(post("/api/v1/auth/sign-up")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(userRequest)))
                                .andExpect(status().isBadRequest());

        }
}
