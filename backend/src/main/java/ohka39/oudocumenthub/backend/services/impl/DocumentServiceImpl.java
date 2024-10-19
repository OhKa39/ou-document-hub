package ohka39.oudocumenthub.backend.services.impl;

import java.net.URL;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EDocumentStatus;
import ohka39.oudocumenthub.backend.events.OnDeleteFile;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.models.OnlineDocument;
import ohka39.oudocumenthub.backend.models.ShipAddress;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.mapper.DocumentMapper;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.OnlineDocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.PaperDocumentRequest;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.FacultyRepository;
import ohka39.oudocumenthub.backend.repositories.ShippingAddressRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IDocumentService;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements IDocumentService {
        private final AmazonS3 s3Client;

        private final UserRepository userRepository;

        private final FacultyRepository facultyRepository;

        private final DocumentRepository documentRepository;

        private final ShippingAddressRepository shippingAddressRepository;

        private final DocumentMapper documentMapper;

        private final String DOCUMENT_THUMBNAIL_FOLDER = "document-thumbnail/";

        private final String DOCUMENT_ONLINE_FOLDER = "document-online-doc/";

        @Value("${aws.s3.bucket-name}")
        private String BUCKET_NAME;

        private final ApplicationEventPublisher eventPublisher;

        @Override
        public DocumentDTO createDocument(DocumentRequest request, MultipartFile image, MultipartFile onlineFile,
                        String userId) {
                User user = userRepository.findById(UUID.fromString(userId))
                                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));
                Faculty faculty = facultyRepository.findById(UUID.fromString(request.getFaculty()))
                                .orElseThrow(() -> new EntityNotFoundException("faculty not found", 1004));

                String randomFileName = UUID.randomUUID().toString();
                eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_THUMBNAIL_FOLDER +
                                randomFileName, image));
                URL url = s3Client.getUrl(BUCKET_NAME, DOCUMENT_THUMBNAIL_FOLDER + randomFileName);

                if (request instanceof OnlineDocumentRequest) {
                        randomFileName = UUID.randomUUID().toString();
                        eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_ONLINE_FOLDER +
                                        randomFileName, onlineFile));
                        URL url1 = s3Client.getUrl(BUCKET_NAME, DOCUMENT_ONLINE_FOLDER + randomFileName);
                        Document document = documentMapper.toDocument(request, faculty, user, url.toExternalForm(),
                                        onlineFile, url1.toExternalForm());
                        documentRepository.save(document);
                        return documentMapper.toDocumentDTO(document);
                } else {
                        PaperDocumentRequest paperRequest = (PaperDocumentRequest) request;
                        List<ShipAddress> addresses = shippingAddressRepository.findAllById(
                                        paperRequest.getShippingAddresses().stream().map(item -> UUID.fromString(item))
                                                        .toList());

                        Document document = documentMapper.toDocument(faculty, user, url.toExternalForm(), addresses,
                                        paperRequest);
                        log.info("document: {}", document);
                        documentRepository.save(document);
                        return documentMapper.toDocumentDTO(document);
                }
        }

        @Override
        public List<DocumentDTO> getDocumentsCreatedByMe(String userId) {
                User user = userRepository.findById(UUID.fromString(userId))
                                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));
                List<DocumentDTO> document = documentRepository.findAllByUserAndIsDeleteFalse(user).stream()
                                .map(item -> documentMapper.toDocumentDTO(item)).toList();
                return document;
        }

        @Override
        public List<DocumentDTO> getDocuments() {
                List<DocumentDTO> documents = documentRepository.findAll().stream()
                                .map(item -> documentMapper.toDocumentDTO(item)).toList();
                return documents;
        }

        @Override
        public void reviewDocument(String id, String status) {
                Document document = documentRepository.findById(UUID.fromString(id))
                                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
                document.setStatus(EDocumentStatus.valueOf(status));
                documentRepository.saveAndFlush(document);
        }

        @Override
        public void deleteDocument(String id) {
                Document document = documentRepository.findById(UUID.fromString(id))
                                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
                if (document.getStatus() == EDocumentStatus.Decline) {
                        eventPublisher.publishEvent(new OnDeleteFile(DOCUMENT_THUMBNAIL_FOLDER
                                        + document.getThumbnailUrl().split(DOCUMENT_THUMBNAIL_FOLDER)[1]));
                        if (document instanceof OnlineDocument) {
                                OnlineDocument onlineDoc = (OnlineDocument) document;
                                eventPublisher.publishEvent(new OnDeleteFile(DOCUMENT_ONLINE_FOLDER
                                                + onlineDoc.getFileUrl().split(DOCUMENT_ONLINE_FOLDER)[1]));
                        }
                        documentRepository.delete(document);
                } else {
                        document.setDelete(true);
                        documentRepository.saveAndFlush(document);
                }
        }

        @Override
        public DocumentDTO getDocumentByShortUrl(String shortUrl) {
                Document document = documentRepository.findByShortUrl(shortUrl)
                                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
                return documentMapper.toDocumentDTO(document);
        }

}
