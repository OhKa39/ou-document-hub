package ohka39.oudocumenthub.backend.services.interfaces;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;

public interface IDocumentService {
    public DocumentDTO createDocument(DocumentRequest request, MultipartFile image, MultipartFile onlineFile,
            String userId);

    public List<DocumentDTO> getDocumentsCreatedByMe(String userId);

    public List<DocumentDTO> getDocuments();

    public void reviewDocument(String id, String status);

    public void deleteDocument(String id);

    public DocumentDTO getDocumentByShortUrl(String shortUrl);
}
