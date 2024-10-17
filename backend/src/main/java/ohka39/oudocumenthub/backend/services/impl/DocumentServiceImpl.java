package ohka39.oudocumenthub.backend.services.impl;

import java.net.URL;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EDocumentType;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.models.OnlineDocument;
import ohka39.oudocumenthub.backend.models.PaperDocument;
import ohka39.oudocumenthub.backend.models.ShipAddress;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.mapper.DocumentMapper;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.OnlineDocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.PaperDocumentRequest;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.FacultyRepository;
import ohka39.oudocumenthub.backend.repositories.OnlineDocumentRepository;
import ohka39.oudocumenthub.backend.repositories.PaperDocumentRepository;
import ohka39.oudocumenthub.backend.repositories.ShippingAddressRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IDocumentService;
import ohka39.oudocumenthub.backend.utils.WordProcess;

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

                Document document = documentMapper.toDocument(request, faculty, user, url.toExternalForm());

                if (request instanceof OnlineDocumentRequest) {
                        randomFileName = UUID.randomUUID().toString();
                        eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_ONLINE_FOLDER +
                                        randomFileName, onlineFile));
                        url = s3Client.getUrl(BUCKET_NAME, DOCUMENT_ONLINE_FOLDER + randomFileName);
                        OnlineDocument onlineDoc = documentMapper.toOnlineDocument(onlineFile, url.toExternalForm());
                        document.setOnlineDocument(onlineDoc);
                        onlineDoc.setDocument(document);
                        documentRepository.save(document);
                        return documentMapper.toDocumentDTO(document, onlineDoc);
                } else {
                        PaperDocumentRequest paperRequest = (PaperDocumentRequest) request;
                        List<ShipAddress> addresses = shippingAddressRepository.findAllById(
                                        paperRequest.getShippingAddresses().stream().map(item -> UUID.fromString(item))
                                                        .toList());
                        PaperDocument paper = documentMapper.toPaperDocument(addresses, paperRequest);
                        paper.setDocument(document);
                        document.setPaperDocument(paper);
                        documentRepository.save(document);
                        return documentMapper.toDocumentDTO(document, paper);
                }
        }

}
