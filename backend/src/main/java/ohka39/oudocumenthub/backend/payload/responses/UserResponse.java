package ohka39.oudocumenthub.backend.payload.responses;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;
import ohka39.oudocumenthub.backend.enums.EGender;

@Data
@Builder
public class UserResponse {
   private String email;
   private String firstName;
   private EGender gender;
   private LocalDate dateOfBirth;
   private LocalDateTime createdAt;
   private String lastName;  
}
