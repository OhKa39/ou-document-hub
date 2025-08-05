package ohka39.oudocumenthub.backend.payload.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EDocumentTag;
import ohka39.oudocumenthub.backend.enums.EDocumentType;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.DocumentImage;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.models.OnlineDocument;
import ohka39.oudocumenthub.backend.models.PaperDocument;
import ohka39.oudocumenthub.backend.models.ShipAddress;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.OnlineDocumentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.PaperDocumentDTO;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.PaperDocumentRequest;
import ohka39.oudocumenthub.backend.utils.WordProcess;

@RequiredArgsConstructor
@Component
@Slf4j
public class DocumentMapper {
    private final ModelMapper modelMapper;

    private final UserMapper userMapper;

    public DocumentDTO toDocumentDTO(Document entity) {
        if (entity.getDocumentType() == EDocumentType.Online) {
            OnlineDocument onlDocument = (OnlineDocument) entity;
            OnlineDocumentDTO temp = modelMapper.map(onlDocument, OnlineDocumentDTO.class);
            temp.setFacultyName(onlDocument.getFaculty().getFacultyName());
            temp.setUser(userMapper.toUserDocumentDetailDTO(entity.getUser()));
            // Include gallery image URLs in the DTO
            if (onlDocument.getGalleryImages() != null &&
                    !onlDocument.getGalleryImages().isEmpty()) {
                temp.setGalleryImageUrls(
                        onlDocument.getGalleryImages().stream()
                                .filter(image -> !image.isDelete())
                                .map(DocumentImage::getImageLink)
                                .collect(Collectors.toList()));
            }
            return temp;
        } else {
            PaperDocument paperDocument = (PaperDocument) entity;
            PaperDocumentDTO temp = modelMapper.map(paperDocument, PaperDocumentDTO.class);
            temp.setFacultyName(paperDocument.getFaculty().getFacultyName());
            temp.setShipAddresses(
                    paperDocument.getShipAddresses().stream()
                            .map(ShipAddress::getAddressName)
                            .toList());
            temp.setUser(userMapper.toUserDocumentDetailDTO(entity.getUser()));
            // Include gallery image URLs in the DTO
            if (paperDocument.getGalleryImages() != null &&
                    !paperDocument.getGalleryImages().isEmpty()) {
                temp.setGalleryImageUrls(
                        paperDocument.getGalleryImages().stream()
                                .filter(image -> !image.isDelete())
                                .map(DocumentImage::getImageLink)
                                .collect(Collectors.toList()));
            }
            return temp;
        }
    }

    public Document toDocument(DocumentRequest request, Faculty faculty, User user, String thumbnailURL,
            EDocumentTag tag,
            MultipartFile onlineFile, String url, List<String> galleryImageUrls) {
        OnlineDocument temp = modelMapper.map(request, OnlineDocument.class);
        temp.setUser(user);
        temp.setFaculty(faculty);
        temp.setShortUrl(
                WordProcess.unstressVietnamese(request.getName()).replaceAll("\\s+", "-") + "-" + temp.getDocumentId());
        temp.setThumbnailUrl(thumbnailURL);
        temp.setFileUrl(url);
        temp.setFileType(FilenameUtils.getExtension(onlineFile.getOriginalFilename()));
        temp.setTag(tag);
        // Map gallery images
        Set<DocumentImage> documentImages = galleryImageUrls.stream().map(urlLink -> {
            DocumentImage image = new DocumentImage();
            image.setDocument(temp);
            image.setImageLink(urlLink);
            image.setDelete(false);
            return image;
        }).collect(Collectors.toSet());
        temp.setGalleryImages(documentImages);
        return temp;
    };

    public Document toDocument(Faculty faculty, User user, String thumbnailURL,
            List<ShipAddress> addresses, EDocumentTag tag, PaperDocumentRequest request,
            List<String> galleryImageUrls) {
        PaperDocument temp = modelMapper.map(request, PaperDocument.class);
        log.info("document Id {}", temp.getDocumentId());
        temp.setUser(user);
        temp.setFaculty(faculty);
        temp.setTag(tag);
        temp.setShortUrl(
                WordProcess.unstressVietnamese(request.getName()).replaceAll("\\s+", "-") + "-" + temp.getDocumentId());
        temp.setThumbnailUrl(thumbnailURL);
        temp.setShipAddresses(addresses.stream().collect(Collectors.toSet()));
        Set<DocumentImage> documentImages = galleryImageUrls.stream().map(urlLink -> {
            DocumentImage image = new DocumentImage();
            image.setDocument(temp);
            image.setImageLink(urlLink);
            image.setDelete(false);
            return image;
        }).collect(Collectors.toSet());
        temp.setGalleryImages(documentImages);
        return temp;
    };
}
