package ohka39.oudocumenthub.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.OnlineDocument;

@Repository
public interface OnlineDocumentRepository extends JpaRepository<OnlineDocument, UUID> {

}
