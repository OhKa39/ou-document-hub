package ohka39.oudocumenthub.backend.models;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ohka39.oudocumenthub.backend.enums.EDocumentType;

@Entity
@Table(name = "online_documents")
@Getter
@Setter
@NoArgsConstructor
public class OnlineDocument extends Document {
    // @Id
    // @Column(name = "document_id", nullable = false)
    // @GeneratedValue(strategy = GenerationType.UUID)
    // private UUID documentId;

    // @Enumerated(EnumType.STRING)
    // @Column(name = "document_type", nullable = false)
    // private EDocumentType documentType = EDocumentType.Online;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_url")
    private String fileUrl;

    // @OneToOne
    // @MapsId
    // @JoinColumn(name = "document_id")
    // private Document document;
}
