package ohka39.oudocumenthub.backend.models;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "seller_information")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SellerInformation {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id")
    @Id
    private UUID userId;

    @Column(name = "is_verified")
    private boolean isVerified;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "account_type")
    private String accountType;

    @Column(name = "merchant_id")
    private String merchantId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}
