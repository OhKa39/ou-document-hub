// backend/src/main/java/ohka39/oudocumenthub/backend/controllers/DocumentController.java
package ohka39.oudocumenthub.backend.controllers;

import java.util.List;
import java.util.Map;
import java.util.Arrays;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;
import ohka39.oudocumenthub.backend.services.interfaces.IDocumentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/documents")
@Slf4j
public class DocumentController {
    private final IDocumentService documentService;

    @PostMapping
    public ResponseEntity<ResponseDTO> createDocument(
            @RequestPart("document") @Valid DocumentRequest request,
            @RequestPart(value = "image", required = true) MultipartFile image,
            @RequestPart(value = "onlineFile", required = false) MultipartFile onlineFile,
            @RequestPart(value = "galleryImages", required = true) MultipartFile[] galleryImages,
            Authentication auth) {
        log.info("request create document: {}", request);
        String id = !(auth.getPrincipal() instanceof DefaultOAuth2User)
                ? ((User) auth.getPrincipal()).getUserId().toString()
                : ((DefaultOAuth2User) auth.getPrincipal()).getName();
        log.info("request galleryImages: {}", galleryImages[0]);
        List<MultipartFile> listGallery = Arrays.asList(galleryImages);
        DocumentDTO document = documentService.createDocument(request, image, onlineFile, id, listGallery);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(), document,
                "create document successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ResponseDTO> getDocumentsCreatedByMe(Authentication auth) {
        String id = !(auth.getPrincipal() instanceof DefaultOAuth2User)
                ? ((User) auth.getPrincipal()).getUserId().toString()
                : ((DefaultOAuth2User) auth.getPrincipal()).getName();
        List<DocumentDTO> document = documentService.getDocumentsCreatedByMe(id);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                "get documents created by me successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/admin")
    public ResponseEntity<ResponseDTO> getDocumentsByAdmin() {
        List<DocumentDTO> document = documentService.getDocumentsByAdmin();
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                "get documents successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping
    @PreAuthorize("permitAll")
    public ResponseEntity<ResponseDTO> getDocuments(
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String faculty,
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) String addresses,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> documents = documentService.getDocuments(
                minPrice, maxPrice, faculty, documentType, rating,
                addresses != null ? Arrays.asList(addresses.split(",")) : null,
                sort, page, size);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), documents,
                "get documents successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PatchMapping("/admin/{id}")
    public ResponseEntity<ResponseDTO> reviewDocuments(@PathVariable String id, @RequestParam String status) {
        documentService.reviewDocument(id, status);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }

    @GetMapping("/url/{shortUrl}")
    @PreAuthorize("permitAll")
    public ResponseEntity<ResponseDTO> getDocumentByShortUrl(@PathVariable String shortUrl) {
        DocumentDTO document = documentService.getDocumentByShortUrl(shortUrl);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                "get document by url successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("permitAll")
    public ResponseEntity<ResponseDTO> getDocumentById(@PathVariable String id) {
        DocumentDTO document = documentService.getDocumentById(id);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                "get document by id successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/suggestions")
    @PreAuthorize("permitAll")
    public Map<String, List<Map<String, Object>>> getSuggestions(
            @RequestParam String prefix,
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "10") int size) {
        return documentService.getSearchSuggestions(prefix, category, size);
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll")
    public Map<String, List<Map<String, Object>>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "all") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return documentService.search(query, category, page, size);
    }
}
