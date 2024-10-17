package ohka39.oudocumenthub.backend.payload.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.io.FilenameUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
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

    public DocumentDTO toDocumentDTO(Document entity, PaperDocument paper) {
        PaperDocumentDTO temp = modelMapper.map(entity, PaperDocumentDTO.class);
        temp.setFacultyName(entity.getFaculty().getFacultyName());
        temp.setCreatedBy(entity.getUser().getLastName() + " " + entity.getUser().getFirstName());
        temp.setStock(paper.getStock());
        temp.setShipAddresses(paper.getShipAddresses().stream().map(item -> item.getAddressName()).toList());
        return temp;
    };

    public DocumentDTO toDocumentDTO(Document entity, OnlineDocument online) {
        OnlineDocumentDTO temp = modelMapper.map(entity, OnlineDocumentDTO.class);
        temp.setFacultyName(entity.getFaculty().getFacultyName());
        temp.setCreatedBy(entity.getUser().getLastName() + " " + entity.getUser().getFirstName());
        temp.setOnlineFile(online.getFileUrl());
        temp.setFileType(online.getFileType());
        return temp;
    };

    public Document toDocument(DocumentRequest request, Faculty faculty, User user, String thumbnailURL) {
        Document temp = modelMapper.map(request, Document.class);
        temp.setUser(user);
        temp.setFaculty(faculty);
        temp.setShortUrl(WordProcess.unstressVietnamese(request.getName()).replaceAll("\\s+", "-"));
        temp.setThumbnailUrl(thumbnailURL);
        return temp;
    };

    public OnlineDocument toOnlineDocument(MultipartFile onlineFile, String url) {
        OnlineDocument onlineDoc = new OnlineDocument();
        onlineDoc.setFileUrl(url);
        onlineDoc.setFileType(FilenameUtils.getExtension(onlineFile.getOriginalFilename()));
        return onlineDoc;
    };

    public PaperDocument toPaperDocument(List<ShipAddress> addresses, PaperDocumentRequest paperRequest) {

        PaperDocument paper = new PaperDocument();
        paper.setStock(paperRequest.getStock());
        paper.setShipAddresses(addresses.stream().collect(Collectors.toSet()));
        return paper;
    }
}
