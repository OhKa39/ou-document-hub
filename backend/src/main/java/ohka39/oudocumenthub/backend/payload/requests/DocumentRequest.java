package ohka39.oudocumenthub.backend.payload.requests;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ohka39.oudocumenthub.backend.enums.EDocumentType;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, // Use the "documentType" field to determine the type
                include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "documentType", visible = true // The JSON field
                                                                                                       // that
                                                                                                       // will specify
                                                                                                       // the
// type
)
@JsonSubTypes({
                @JsonSubTypes.Type(value = PaperDocumentRequest.class, name = "Paper"),
                @JsonSubTypes.Type(value = OnlineDocumentRequest.class, name = "Online")
})
public abstract class DocumentRequest {
        // @NotNull(message = "Image cannot be empty")
        // @Size(max = 5000000, message = "Image must be smaller than 5 MB")
        // private MultipartFile image;

        @NotBlank(message = "Document name must be at least 2 characters")
        @Size(min = 2, message = "Document name must be at least 2 characters")
        private String name;

        @NotBlank(message = "Document description must be at least 10 characters")
        @Size(min = 10, message = "Document description must be at least 10 characters")
        private String description;

        @NotNull(message = "Document price must be greater than 0")
        @DecimalMin(value = "0.0", inclusive = false, message = "Document price must be greater than 0")
        private Double price;

        @NotBlank(message = "Faculty cannot be empty")
        private String faculty;

        // @NotNull(message = "documentType cannot be empty")
        private EDocumentType documentType;
}
