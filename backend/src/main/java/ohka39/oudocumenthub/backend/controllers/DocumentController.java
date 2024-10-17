package ohka39.oudocumenthub.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
import ohka39.oudocumenthub.backend.payload.requests.OnlineDocumentRequest;
import ohka39.oudocumenthub.backend.services.interfaces.IDocumentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/documents")
@Slf4j
public class DocumentController {
    private final IDocumentService documentService;

    @PostMapping
    public ResponseEntity<ResponseDTO> createDocument(@RequestPart("document") @Valid DocumentRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "onlineFile", required = false) MultipartFile onlineFile, Authentication auth) {
        log.info("request create document: {}", request);
        DocumentDTO document = documentService.createDocument(request, image, onlineFile,
                ((User) auth.getPrincipal()).getUserId().toString());
        ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED, document, "create document successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }
}
