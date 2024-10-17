package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FacultyDTO implements Serializable {
    private String facultyID;
    private String facultyName;
}
