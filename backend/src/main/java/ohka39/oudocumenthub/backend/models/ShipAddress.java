package ohka39.oudocumenthub.backend.models;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ship_addresses")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "address_id", nullable = false)
    private UUID addressId;

    @Column(name = "address_name", nullable = false)
    private String addressName;

    @Builder.Default
    @ManyToMany(mappedBy = "shipAddresses")
    private Set<PaperDocument> paperDocuments = new HashSet<>();
}
