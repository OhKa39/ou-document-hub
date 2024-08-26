package ohka39.oudocumenthub.backend.models;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.redis.core.RedisHash;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ohka39.oudocumenthub.backend.enums.ERole;

@Entity
@Table(name = "roles")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Role {
    @Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID role_id;

	@Enumerated(EnumType.STRING)
	@Column(length = 20, unique = true)
	private ERole name;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}
