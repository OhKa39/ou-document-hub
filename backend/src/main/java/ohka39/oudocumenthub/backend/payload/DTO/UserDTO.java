package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;
import java.security.Provider;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ohka39.oudocumenthub.backend.enums.EGender;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.models.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
   private boolean isBanned;
   private boolean isEnable;
}
