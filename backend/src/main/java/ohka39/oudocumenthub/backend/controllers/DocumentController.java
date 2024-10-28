package ohka39.oudocumenthub.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
        public ResponseEntity<ResponseDTO> createDocument(@RequestPart("document") @Valid DocumentRequest request,
                        @RequestPart(value = "image", required = false) MultipartFile image,
                        @RequestPart(value = "onlineFile", required = false) MultipartFile onlineFile,
                        Authentication auth) {
                log.info("request create document: {}", request);
                DocumentDTO document = documentService.createDocument(request, image, onlineFile,
                                ((User) auth.getPrincipal()).getUserId().toString());
                ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(), document,
                                "create document successfully");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping("/me")
        public ResponseEntity<ResponseDTO> getDocumentsCreatedByMe(Authentication auth) {
                List<DocumentDTO> document = documentService
                                .getDocumentsCreatedByMe(((User) auth.getPrincipal()).getUserId().toString());
                ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                                "get documents created by me successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @GetMapping("/admin")
        public ResponseEntity<ResponseDTO> getDocumentsByAdmin() {
                List<DocumentDTO> document = documentService
                                .getDocumentsByAdmin();
                ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
                                "get documents successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }

        @GetMapping
        @PreAuthorize("permitAll")
        public ResponseEntity<ResponseDTO> getDocuments() {
                List<DocumentDTO> document = documentService
                                .getDocuments();
                ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), document,
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
                                "get document by url successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
        }
}
