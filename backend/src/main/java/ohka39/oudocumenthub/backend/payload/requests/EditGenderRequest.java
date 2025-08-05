package ohka39.oudocumenthub.backend.payload.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditGenderRequest {
    @Pattern(regexp = "male|female|other", message = "gender must be 'male', 'female', or 'other'", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String gender;
}
