package ohka39.oudocumenthub.backend.payload.requests;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import ohka39.oudocumenthub.backend.enums.EGender;

@Data
@AllArgsConstructor
@Builder
public class UserRequest {

    @NotBlank(message = "email is required")
    @Email
    private final String email;

    @NotNull(message = "gender is required")
    private final EGender gender;

    @NotBlank(message = "password is required")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{8,50}$", message = "password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character")
    private final String password;

    @NotBlank(message = "first name is required")
    @Size(min = 2, max = 40, message = "first name from 2 to 40 character")
    @Pattern(regexp = "^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+(?:[-\\s][A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+)*$", message = "first name must contain only letters")
    private final String firstName;

    @NotBlank(message = "last name is required")
    @Size(min = 2, max = 40, message = "last name from 2 to 40 character")
    @Pattern(regexp = "^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+(?:[-\\s][A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹý]+)*$", message = "last name must contain only letters")
    private final String lastName;

    @NotNull(message = "date of birth is required")
    private final LocalDate dateOfBirth;
}
