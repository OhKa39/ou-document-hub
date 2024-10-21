package ohka39.oudocumenthub.backend.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ohka39.oudocumenthub.backend.enums.EDocumentStatus;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.User;

public interface DocumentRepository extends JpaRepository<Document, UUID> {

    List<Document> findAllByUserAndIsDeleteFalse(User user);

    Optional<Document> findByShortUrl(String shortUrl);

    List<Document> findAllByIsDeleteFalseAndStatus(EDocumentStatus status);
}
