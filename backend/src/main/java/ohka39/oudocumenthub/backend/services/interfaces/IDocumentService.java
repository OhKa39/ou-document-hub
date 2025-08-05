// backend/src/main/java/ohka39/oudocumenthub/backend/services/interfaces/IDocumentService.java
package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;

public interface IDocumentService {
    DocumentDTO createDocument(DocumentRequest request, MultipartFile image, MultipartFile onlineFile,
            String userId, List<MultipartFile> galleryImages);

    List<DocumentDTO> getDocumentsCreatedByMe(String userId);

    List<DocumentDTO> getDocumentsByAdmin();

    Map<String, Object> getDocuments(Integer minPrice, Integer maxPrice, String faculty, String documentType,
            Integer rating, List<String> addresses, String sort, int page, int size);

    void reviewDocument(String id, String status);

    void deleteDocument(String id);

    DocumentDTO getDocumentByShortUrl(String shortUrl);

    DocumentDTO getDocumentById(String id);

    Map<String, List<Map<String, Object>>> getSearchSuggestions(String prefix, String category, int size);

    Map<String, List<Map<String, Object>>> search(String query, String category, int page, int size);
}
