package ohka39.oudocumenthub.backend.models;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ohka39.oudocumenthub.backend.enums.EDocumentType;

@Entity
@Table(name = "paper_documents")
@NoArgsConstructor
@Getter
@Setter
public class PaperDocument {

    @Id
    // @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "document_id")
    private UUID documentId;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private EDocumentType documentType = EDocumentType.Paper; // Default to 2 as specified

    @ManyToMany
    @JoinTable(name = "paperdocument_shipaddress", joinColumns = @JoinColumn(name = "document_id"), inverseJoinColumns = @JoinColumn(name = "address_id"))
    private Set<ShipAddress> shipAddresses = new HashSet<>();

    @Column(name = "stock")
    private int stock;

    @OneToOne
    @MapsId
    @JoinColumn(name = "document_id")
    private Document document;

}
