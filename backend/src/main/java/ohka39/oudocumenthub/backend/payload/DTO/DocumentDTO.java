package ohka39.oudocumenthub.backend.payload.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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
    private EDocumentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String description;
    private String shortUrl;
    private EDocumentTag tag;
    private BigDecimal price;
    private String thumbnailUrl;
    private String facultyName;
    private String createdBy;
}
