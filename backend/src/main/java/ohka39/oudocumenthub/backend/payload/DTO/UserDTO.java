package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ohka39.oudocumenthub.backend.enums.EGender;
import ohka39.oudocumenthub.backend.enums.EProvider;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO implements Serializable {
   private UUID userId;
   private String email;
   private String firstName;
   private EGender gender;
   private LocalDate dateOfBirth;
   private String lastName;
   private List<String> roles;
   private EProvider provider;
   private String avatarLink;
   private LocalDateTime createdAt;
   private LocalDateTime updatedAt;
   private Boolean isBanned;
   private Boolean isEnable;
}
