package ohka39.oudocumenthub.backend.payload.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.enums.EDocumentType;
import ohka39.oudocumenthub.backend.models.Document;
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
public class DocumentMapper {
    private final ModelMapper modelMapper;

    public DocumentDTO toDocumentDTO(Document entity) {
        if (entity.getDocumentType() == EDocumentType.Online) {
            OnlineDocument onlDocument = (OnlineDocument) entity;
            OnlineDocumentDTO temp = modelMapper.map(onlDocument, OnlineDocumentDTO.class);
            temp.setFacultyName(onlDocument.getFaculty().getFacultyName());
            temp.setCreatedBy(onlDocument.getUser().getLastName() + " " + onlDocument.getUser().getFirstName());
            temp.setCreatedByAvatar(onlDocument.getUser().getAvatarLink());
            temp.setOnlineFile(onlDocument.getFileUrl());
            temp.setFileType(onlDocument.getFileType());
            return temp;
        } else {
            PaperDocument paperDocument = (PaperDocument) entity;
            PaperDocumentDTO temp = modelMapper.map(paperDocument, PaperDocumentDTO.class);
            temp.setFacultyName(paperDocument.getFaculty().getFacultyName());
            temp.setCreatedBy(paperDocument.getUser().getLastName() + " " + paperDocument.getUser().getFirstName());
            temp.setStock(paperDocument.getStock());
            temp.setCreatedByAvatar(paperDocument.getUser().getAvatarLink());
            temp.setShipAddresses(
                    paperDocument.getShipAddresses().stream().map(item -> item.getAddressName()).toList());
            return temp;
        }
    };

    public Document toDocument(DocumentRequest request, Faculty faculty, User user, String thumbnailURL,
            MultipartFile onlineFile, String url) {
        OnlineDocument temp = modelMapper.map(request, OnlineDocument.class);
        temp.setUser(user);
        temp.setFaculty(faculty);
        temp.setShortUrl(
                WordProcess.unstressVietnamese(request.getName()).replaceAll("\\s+", "-") + "-" + temp.getDocumentId());
        temp.setThumbnailUrl(thumbnailURL);
        temp.setFileUrl(url);
        temp.setFileType(FilenameUtils.getExtension(onlineFile.getOriginalFilename()));
        return temp;
    };

    public Document toDocument(Faculty faculty, User user, String thumbnailURL,
            List<ShipAddress> addresses, PaperDocumentRequest request) {
        PaperDocument temp = modelMapper.map(request, PaperDocument.class);
        temp.setUser(user);
        temp.setFaculty(faculty);
        temp.setShortUrl(
                WordProcess.unstressVietnamese(request.getName()).replaceAll("\\s+", "-") + "-" + temp.getDocumentId());
        temp.setThumbnailUrl(thumbnailURL);
        temp.setShipAddresses(addresses.stream().collect(Collectors.toSet()));
        return temp;
    };
}
