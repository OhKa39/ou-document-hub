package ohka39.oudocumenthub.backend.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ohka39.oudocumenthub.backend.models.PaperDocument;

@Repository
public interface PaperDocumentRepository extends JpaRepository<PaperDocument, UUID> {

}
