package ohka39.oudocumenthub.backend.payload.DTO;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ohka39.oudocumenthub.backend.enums.EDocumentStatus;
import ohka39.oudocumenthub.backend.enums.EDocumentTag;
import ohka39.oudocumenthub.backend.enums.EDocumentType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class DocumentDTO implements Serializable {
    private UUID documentId;
    private EDocumentType documentType;
    private String name;
    private EDocumentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String shortUrl;
    private String description;
    private EDocumentTag tag;
    private BigDecimal price;
    private String thumbnailUrl;
    private String facultyName;
    private UserDTO user;

}
