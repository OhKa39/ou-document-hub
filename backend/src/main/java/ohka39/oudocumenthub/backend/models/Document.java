package ohka39.oudocumenthub.backend.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ohka39.oudocumenthub.backend.enums.EDocumentStatus;
import ohka39.oudocumenthub.backend.enums.EDocumentTag;
import ohka39.oudocumenthub.backend.enums.EDocumentType;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "document_id")
    private UUID documentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type")
    private EDocumentType documentType;

    @Column(name = "document_name", length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private EDocumentStatus status = EDocumentStatus.Not_Verified;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "short_url", length = 255)
    private String shortUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    @Builder.Default
    private EDocumentTag tag = EDocumentTag.New;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "thumbnail_url", length = 255)
    private String thumbnailUrl;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private OnlineDocument onlineDocument;

    @OneToOne(mappedBy = "document", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private PaperDocument paperDocument;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User user;
}
