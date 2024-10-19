package ohka39.oudocumenthub.backend.payload.DTO;

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
public abstract class DocumentDTO {
    private UUID documentId;
    private EDocumentType documentType;
    private String name;
    private EDocumentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String shortUrl;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String description;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private EDocumentTag tag;
    private BigDecimal price;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String thumbnailUrl;
    private String facultyName;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createdBy;

    private String createdByAvatar;
}
