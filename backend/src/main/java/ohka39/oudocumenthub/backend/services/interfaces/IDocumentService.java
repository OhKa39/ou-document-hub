package ohka39.oudocumenthub.backend.services.interfaces;

import org.springframework.web.multipart.MultipartFile;

import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;

public interface IDocumentService {
    public DocumentDTO createDocument(DocumentRequest request, MultipartFile image, MultipartFile onlineFile,
            String userId);
}
