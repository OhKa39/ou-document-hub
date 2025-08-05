// backend/src/main/java/ohka39/oudocumenthub/backend/services/impl/DocumentServiceImpl.java
package ohka39.oudocumenthub.backend.services.impl;

import java.net.URL;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldSort;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermsQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermsQueryField;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MultiMatchQuery;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.CompletionSuggestOption;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.SortOptions;
import co.elastic.clients.json.JsonData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EDocumentStatus;
import ohka39.oudocumenthub.backend.enums.EDocumentTag;
import ohka39.oudocumenthub.backend.enums.EDocumentType;
import ohka39.oudocumenthub.backend.events.OnDeleteFile;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Document;
import ohka39.oudocumenthub.backend.models.DocumentES;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.models.OnlineDocument;
import ohka39.oudocumenthub.backend.models.ShipAddress;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.models.UserES;
import ohka39.oudocumenthub.backend.payload.DTO.DocumentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.OnlineDocumentDTO;
import ohka39.oudocumenthub.backend.payload.DTO.PaperDocumentDTO;
import ohka39.oudocumenthub.backend.payload.mapper.DocumentMapper;
import ohka39.oudocumenthub.backend.payload.requests.DocumentRequest;
import ohka39.oudocumenthub.backend.payload.requests.PaperDocumentRequest;
import ohka39.oudocumenthub.backend.repositories.DocumentRepository;
import ohka39.oudocumenthub.backend.repositories.FacultyRepository;
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
    private final String DOCUMENT_GALLERY_FOLDER = "document-gallery-images/";
    private final ElasticsearchOperations elasticsearchOperations;
    private final ElasticsearchClient elasticsearchClient;
    @Value("${aws.s3.bucket-name}")
    private String BUCKET_NAME;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public DocumentDTO createDocument(DocumentRequest request, MultipartFile image, MultipartFile onlineFile,
            String userId, List<MultipartFile> galleryImages) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new EntityNotFoundException("user not found", 1000));
        Faculty faculty = facultyRepository.findById(UUID.fromString(request.getFaculty()))
                .orElseThrow(() -> new EntityNotFoundException("faculty not found", 1004));

        String thumbnailUrl = null;
        if (image != null && !image.isEmpty()) {
            String randomFileName = UUID.randomUUID().toString();
            eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_THUMBNAIL_FOLDER + randomFileName, image));
            URL url = s3Client.getUrl(BUCKET_NAME, DOCUMENT_THUMBNAIL_FOLDER + randomFileName);
            thumbnailUrl = url.toExternalForm();
        }

        List<String> galleryImageUrls = new ArrayList<>();
        if (galleryImages != null && !galleryImages.isEmpty()) {
            galleryImageUrls = galleryImages.stream().map(galleryImage -> {
                String randomFileName = UUID.randomUUID().toString();
                eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_GALLERY_FOLDER + randomFileName, galleryImage));
                URL url = s3Client.getUrl(BUCKET_NAME, DOCUMENT_GALLERY_FOLDER + randomFileName);
                return url.toExternalForm();
            }).collect(Collectors.toList());
        }

        Document document;
        if (request.getDocumentType() == EDocumentType.Online) {
            String fileUrl = null;
            if (onlineFile != null && !onlineFile.isEmpty()) {
                String randomFileName = UUID.randomUUID().toString();
                eventPublisher.publishEvent(new OnUploadFile(DOCUMENT_ONLINE_FOLDER + randomFileName, onlineFile));
                URL url = s3Client.getUrl(BUCKET_NAME, DOCUMENT_ONLINE_FOLDER + randomFileName);
                fileUrl = url.toExternalForm();
            }

            document = documentMapper.toDocument(request, faculty, user, thumbnailUrl, EDocumentTag.New, onlineFile,
                    fileUrl, galleryImageUrls);
            document = documentRepository.save(document);
            document.setShortUrl(
                    WordProcess.unstressVietnamese(document.getName()).replaceAll("\\s+", "-") + "--"
                            + document.getDocumentId());
            document = documentRepository.save(document);
        } else {
            PaperDocumentRequest paperRequest = (PaperDocumentRequest) request;
            List<ShipAddress> addresses = shippingAddressRepository.findAllById(
                    paperRequest.getShippingAddresses().stream()
                            .map(UUID::fromString)
                            .toList());

            document = documentMapper.toDocument(faculty, user, thumbnailUrl, addresses, EDocumentTag.New, paperRequest,
                    galleryImageUrls);
            document = documentRepository.save(document);
            document.setShortUrl(
                    WordProcess.unstressVietnamese(document.getName()).replaceAll("\\s+", "-") + "--"
                            + document.getDocumentId());
            document = documentRepository.save(document);
        }

        return documentMapper.toDocumentDTO(document);
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
    public List<DocumentDTO> getDocumentsByAdmin() {
        List<DocumentDTO> documents = documentRepository.findAll().stream()
                .map(item -> documentMapper.toDocumentDTO(item)).toList();
        return documents;
    }

    @Override
    public Map<String, Object> getDocuments(Integer minPrice, Integer maxPrice, String faculty, String documentType,
            Integer rating, List<String> addresses, String sort, int page, int size) {
        log.info(
                "getDocuments called with: minPrice={}, maxPrice={}, faculty={}, documentType={}, rating={}, addresses={}, sort={}, page={}, size={}",
                minPrice, maxPrice, faculty, documentType, rating, addresses, sort, page, size);

        BoolQuery.Builder boolQuery = new BoolQuery.Builder();
        boolean hasFilters = false; // Track if any filters are applied

        // Base filters: status=Verified, isDelete=false (commented out for debugging)
        // boolQuery.filter(TermQuery.of(t ->
        // t.field("status").value("Verified"))._toQuery());
        // boolQuery.filter(TermQuery.of(t ->
        // t.field("is_delete").value(false))._toQuery());

        // Price range filter
        if (minPrice != null || maxPrice != null) {
            RangeQuery.Builder rangeQuery = new RangeQuery.Builder().field("price");
            if (minPrice != null)
                rangeQuery.gte(JsonData.of(minPrice.doubleValue()));
            if (maxPrice != null)
                rangeQuery.lte(JsonData.of(maxPrice.doubleValue()));
            boolQuery.filter(rangeQuery.build()._toQuery());
            hasFilters = true;
        }

        // Faculty filter
        if (faculty != null && !faculty.isEmpty()) {
            boolQuery.filter(TermQuery.of(t -> t.field("faculty_id").value(faculty))._toQuery());
            hasFilters = true;
        }

        // Document type filter
        if (documentType != null && !documentType.isEmpty()) {
            boolQuery.filter(TermQuery.of(t -> t.field("document_type.keyword").value(documentType))._toQuery());
            hasFilters = true;
        }

        // Rating filter
        if (rating != null) {
            RangeQuery.Builder rangeQuery = new RangeQuery.Builder().field("rating");
            rangeQuery.gte(JsonData.of(rating.doubleValue()));
            boolQuery.filter(rangeQuery.build()._toQuery());
            hasFilters = true;
        }

        // Shipping addresses filter
        if (addresses != null && !addresses.isEmpty()) {
            boolQuery.filter(TermsQuery.of(t -> t
                    .field("ship_addresses")
                    .terms(TermsQueryField.of(tf -> tf
                            .value(addresses.stream()
                                    .map(FieldValue::of)
                                    .collect(Collectors.toList())))))
                    ._toQuery());
            hasFilters = true;
        }

        // Use match_all if no filters are applied
        Query finalQuery = boolQuery.build()._toQuery();

        // Sorting
        final FieldSort sortOption;
        if (sort != null) {
            switch (sort) {
                case "newest":
                    sortOption = FieldSort.of(f -> f.field("created_at").order(SortOrder.Desc));
                    break;
                case "oldest":
                    sortOption = FieldSort.of(f -> f.field("created_at").order(SortOrder.Asc));
                    break;
                case "priceAsc":
                    sortOption = FieldSort.of(f -> f.field("price").order(SortOrder.Asc));
                    break;
                case "priceDesc":
                    sortOption = FieldSort.of(f -> f.field("price").order(SortOrder.Desc));
                    break;
                case "nameAsc":
                    sortOption = FieldSort.of(f -> f.field("document_name").order(SortOrder.Asc));
                    break;
                case "nameDesc":
                    sortOption = FieldSort.of(f -> f.field("document_name").order(SortOrder.Asc));
                    break;
                case "ratingDesc":
                    sortOption = FieldSort.of(f -> f.field("rating").order(SortOrder.Desc));
                    break;
                default:
                    sortOption = FieldSort.of(f -> f.field("created_at").order(SortOrder.Desc));
                    break;
            }
        } else {
            sortOption = FieldSort.of(f -> f.field("created_at").order(SortOrder.Desc));
        }

        NativeQuery query = NativeQuery.builder()
                .withQuery(finalQuery)
                .withSort(SortOptions.of(so -> so.field(sortOption)))
                .withPageable(PageRequest.of(page, size))
                .build();

        SearchHits<DocumentES> searchHits = elasticsearchOperations.search(query, DocumentES.class);
        List<DocumentDTO> results = searchHits.getSearchHits().stream()
                .map(hit -> {
                    DocumentES doc = hit.getContent();
                    log.info("doc string: {}", doc.toString());
                    log.info("Found document: id={}, name={}, type={}, status={}, is_delete={}",
                            doc.getDocumentId(), doc.getDocumentName(), doc.getDocumentType(), doc.getStatus(),
                            doc.getIsDelete());
                    DocumentDTO dto;
                    if ("Online".equals(doc.getDocumentType())) {
                        dto = new OnlineDocumentDTO();
                        ((OnlineDocumentDTO) dto).setOnlineFile(doc.getOnlineFileUrl());
                        ((OnlineDocumentDTO) dto).setFileType(doc.getOnlineFileType());
                    } else {
                        dto = new PaperDocumentDTO();
                        ((PaperDocumentDTO) dto).setStock(doc.getStock() != null ? doc.getStock() : 0);
                        ((PaperDocumentDTO) dto).setShipAddresses(doc.getShipAddresses());
                    }
                    dto.setDocumentId(doc.getDocumentId());
                    dto.setName(doc.getDocumentName());
                    dto.setPrice(doc.getPrice());
                    dto.setRating(doc.getRating());
                    dto.setThumbnailUrl(doc.getThumbnailUrl());
                    dto.setShortUrl(doc.getShortUrl());
                    dto.setDocumentType(EDocumentType.valueOf(doc.getDocumentType()));
                    dto.setFacultyName(doc.getFacultyName());
                    dto.setCreatedAt(doc.getCreatedAt() != null
                            ? LocalDateTime.ofInstant(doc.getCreatedAt(), ZoneId.systemDefault())
                            : null);
                    dto.setUpdatedAt(doc.getUpdatedAt() != null
                            ? LocalDateTime.ofInstant(doc.getUpdatedAt(), ZoneId.systemDefault())
                            : null);
                    dto.setStatus(doc.getStatus() != null ? EDocumentStatus.valueOf(doc.getStatus()) : null);
                    dto.setTag(doc.getTag() != null ? EDocumentTag.valueOf(doc.getTag()) : null);
                    dto.setDescription(doc.getDescription());
                    dto.setGalleryImageUrls(doc.getImages());
                    return dto;
                })
                .collect(Collectors.toList());
        // Add pagination metadata
        Map<String, Object> response = new HashMap<>();
        response.put("data", results);
        response.put("totalPages", (int) Math.ceil((double) searchHits.getTotalHits() / size));
        response.put("totalElements", searchHits.getTotalHits());

        log.info("Returning {} documents, totalPages: {}, totalElements: {}", results.size(),
                response.get("totalPages"), response.get("totalElements"));
        log.info("Returning {} documents", results.size());
        return response;
    }

    @Override
    public void reviewDocument(String id, String status) {
        Document document = documentRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
        EDocumentStatus statusChange = EDocumentStatus.valueOf(status) != EDocumentStatus.Verified
                ? EDocumentStatus.Verified
                : EDocumentStatus.Decline;

        document.setStatus(statusChange);
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
        }
        document.setDelete(true);
        documentRepository.saveAndFlush(document);
    }

    @Override
    public DocumentDTO getDocumentByShortUrl(String shortUrl) {
        Document document = documentRepository.findByShortUrl(shortUrl)
                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
        return documentMapper.toDocumentDTO(document);
    }

    @Override
    public DocumentDTO getDocumentById(String id) {
        Document document = documentRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> new EntityNotFoundException("document not found", 1007));
        return documentMapper.toDocumentDTO(document);
    }

    @Override
    public Map<String, List<Map<String, Object>>> search(String query, String category, int page, int size) {
        Map<String, List<Map<String, Object>>> results = new HashMap<>();

        if (category.equals("all") || category.equals("documents")) {
            MatchQuery matchQuery = new MatchQuery.Builder()
                    .field("document_name")
                    .query(query)
                    .fuzziness("AUTO")
                    .build();
            TermQuery statusFilter = new TermQuery.Builder()
                    .field("status.keyword")
                    .value("Verified")
                    .build();
            TermQuery isDeleteFilter = new TermQuery.Builder()
                    .field("is_delete")
                    .value(false)
                    .build();
            BoolQuery boolQuery = new BoolQuery.Builder()
                    .must(matchQuery._toQuery())
                    .filter(statusFilter._toQuery())
                    .filter(isDeleteFilter._toQuery())
                    .build();
            NativeQuery docQuery = NativeQuery.builder()
                    .withQuery(boolQuery._toQuery())
                    .withPageable(PageRequest.of(page, size))
                    .build();

            SearchHits<DocumentES> docHits = elasticsearchOperations.search(docQuery, DocumentES.class);
            List<Map<String, Object>> docResults = docHits.getSearchHits().stream()
                    .map(hit -> {
                        DocumentES doc = hit.getContent();
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", doc.getDocumentId().toString());
                        result.put("title", doc.getDocumentName());
                        result.put("category", doc.getFacultyName());
                        result.put("url", "/documents/" + doc.getDocumentId());
                        result.put("image", doc.getThumbnailUrl() != null ? doc.getThumbnailUrl() : "");
                        result.put("type", "document");
                        return result;
                    })
                    .collect(Collectors.toList());
            results.put("Documents", docResults);
        } else {
            results.put("Documents", List.of());
        }

        if (category.equals("all") || category.equals("sellers")) {
            Query multiMatchQuery = new MultiMatchQuery.Builder()
                    .query(query)
                    .fields(List.of("first_name", "last_name"))
                    .fuzziness("AUTO")
                    .build()
                    ._toQuery();

            NativeQuery userQuery = NativeQuery.builder()
                    .withQuery(multiMatchQuery)
                    .withPageable(PageRequest.of(page, size))
                    .build();

            SearchHits<UserES> userHits = elasticsearchOperations.search(userQuery, UserES.class);
            List<Map<String, Object>> userResults = userHits.getSearchHits().stream()
                    .map(hit -> {
                        UserES user = hit.getContent();
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", user.getUserId().toString());
                        result.put("title", user.getFirstName() + " " + user.getLastName());
                        result.put("category",
                                user.getIsVerified() != null && user.getIsVerified() ? "Verified Seller" : "Seller");
                        result.put("url", "/sellers/" + user.getUserId());
                        result.put("image", user.getAvatarLink() != null ? user.getAvatarLink() : "");
                        result.put("type", "seller");
                        return result;
                    })
                    .collect(Collectors.toList());
            results.put("Sellers", userResults);
        } else {
            results.put("Sellers", List.of());
        }

        return results;
    }

    @Override
    public Map<String, List<Map<String, Object>>> getSearchSuggestions(String prefix, String category, int size) {
        Map<String, List<Map<String, Object>>> suggestions = new HashMap<>();

        if (category.equals("all") || category.equals("documents")) {
            log.info("Searching documents with prefix: {}, category: {}", prefix, category);
            try {
                String sanitizedPrefix = prefix != null ? prefix.trim().toLowerCase() : "";
                log.info("Input prefix: '{}'", sanitizedPrefix);

                SearchResponse<Void> response = elasticsearchClient.search(search -> search
                        .index("documents_v2")
                        .size(0)
                        .suggest(suggester -> suggester
                                .text(sanitizedPrefix)
                                .suggesters("document_name_suggest", builder -> builder
                                        .completion(c -> c
                                                .field("document_name_suggest")
                                                .fuzzy(f -> f.fuzziness("AUTO"))
                                                .size(size)
                                                .skipDuplicates(true)))),
                        Void.class);

                List<String> suggestionTexts = Optional.ofNullable(response.suggest())
                        .map(suggest -> suggest.get("document_name_suggest"))
                        .filter(suggestionsList -> !suggestionsList.isEmpty())
                        .map(suggestionsList -> suggestionsList.get(0).completion().options())
                        .map(options -> options.stream()
                                .map(CompletionSuggestOption::text)
                                .collect(Collectors.toList()))
                        .orElse(Collections.emptyList());

                log.info("Suggestion texts for prefix '{}': {}", sanitizedPrefix, suggestionTexts);

                List<Map<String, Object>> docSuggestions = Collections.emptyList();
                if (!suggestionTexts.isEmpty()) {
                    SearchResponse<DocumentES> searchResponse = elasticsearchClient.search(search -> search
                            .index("documents_v2")
                            .query(q -> q
                                    .bool(b -> b
                                            .should(suggestionTexts.stream()
                                                    .map(text -> QueryBuilders.match()
                                                            .field("document_name")
                                                            .query(text)
                                                            .build()
                                                            ._toQuery())
                                                    .collect(Collectors.toList()))))
                            .size(size)
                            .source(s -> s
                                    .filter(f -> f
                                            .includes("document_id", "document_name", "faculty_name",
                                                    "short_url", "thumbnail_url", "status", "is_delete"))),
                            DocumentES.class);

                    log.info("Follow-up query hits: {}", searchResponse.hits().hits().stream()
                            .map(hit -> hit.source() != null ? hit.source().getDocumentName() : "null")
                            .collect(Collectors.toList()));

                    docSuggestions = searchResponse.hits().hits().stream()
                            .map(hit -> {
                                DocumentES doc = hit.source();
                                if (doc == null) {
                                    return null;
                                }

                                if (!"Verified".equals(doc.getStatus()) ||
                                        Boolean.TRUE.equals(doc.getIsDelete())) {
                                    return null;
                                }

                                log.info("test status: {}", doc.getStatus());
                                Map<String, Object> result = new HashMap<>();
                                result.put("id", doc.getDocumentId().toString());
                                result.put("title", doc.getDocumentName());
                                result.put("category", doc.getFacultyName());
                                result.put("url", "/documents/" + doc.getShortUrl());
                                result.put("image", doc.getThumbnailUrl() != null ? doc.getThumbnailUrl() : "");
                                result.put("type", "document");
                                log.info("Found document suggestion: {}", doc.getDocumentName());
                                return result;
                            })
                            .filter(Objects::nonNull)
                            .distinct()
                            .limit(size)
                            .collect(Collectors.toList());
                }

                suggestions.put("Documents", docSuggestions);
            } catch (Exception e) {
                log.error("Error fetching document suggestions: {}", e.getMessage(), e);
                suggestions.put("Documents", List.of());
            }
        } else {
            suggestions.put("Documents", List.of());
        }

        if (category.equals("all") || category.equals("sellers")) {
            try {
                String[] terms = prefix.trim().split("\\s+");
                Map<String, List<UserES>> matchesPerTerm = new HashMap<>();

                for (String term : terms) {
                    if (term.isEmpty())
                        continue;

                    log.info("Running suggester for term: {}", term);
                    SearchResponse<UserES> response = elasticsearchClient.search(s -> s
                            .index("users")
                            .suggest(suggester -> suggester
                                    .text(term)
                                    .suggesters("first_name_suggest", suggestField -> suggestField
                                            .completion(c -> c
                                                    .field("first_name.suggest")
                                                    .size(size)
                                                    .skipDuplicates(true)))
                                    .suggesters("last_name_suggest", suggestField -> suggestField
                                            .completion(c -> c
                                                    .field("last_name.suggest")
                                                    .size(size)
                                                    .skipDuplicates(true))))
                            .size(0),
                            UserES.class);

                    List<UserES> matchingUsers = new ArrayList<>();
                    if (response.suggest() != null) {
                        if (response.suggest().get("first_name_suggest") != null) {
                            for (var suggestion : response.suggest().get("first_name_suggest")) {
                                for (CompletionSuggestOption<UserES> option : suggestion.completion().options()) {
                                    UserES user = option.source();
                                    if (user != null) {
                                        matchingUsers.add(user);
                                        log.info("Matched user for first_name: {} {}", user.getFirstName(),
                                                user.getLastName());
                                    }
                                }
                            }
                        }

                        if (response.suggest().get("last_name_suggest") != null) {
                            for (var suggestion : response.suggest().get("last_name_suggest")) {
                                for (CompletionSuggestOption<UserES> option : suggestion.completion().options()) {
                                    UserES user = option.source();
                                    if (user != null) {
                                        matchingUsers.add(user);
                                        log.info("Matched user for last_name: {} {}", user.getFirstName(),
                                                user.getLastName());
                                    }
                                }
                            }
                        }
                    }

                    matchesPerTerm.put(term, matchingUsers);
                    log.info("Term {} matched {} users", term, matchingUsers.size());
                }

                List<Map<String, Object>> userSuggestions = new ArrayList<>();
                if (!matchesPerTerm.isEmpty()) {
                    List<UserES> finalMatches = new ArrayList<>(matchesPerTerm.values().iterator().next());
                    for (List<UserES> matches : matchesPerTerm.values()) {
                        finalMatches.retainAll(matches);
                    }

                    log.info("Final matches after intersection: {}", finalMatches.size());

                    userSuggestions = finalMatches.stream()
                            .map(user -> {
                                Map<String, Object> result = new HashMap<>();
                                result.put("id", user.getUserId().toString());
                                result.put("title", user.getFirstName() + " " + user.getLastName());
                                result.put("category", "seller");
                                result.put("url", "/sellers/" + user.getUserId());
                                result.put("image", user.getAvatarLink());
                                result.put("type", "sellers");
                                return result;
                            })
                            .distinct()
                            .limit(size)
                            .collect(Collectors.toList());
                }

                suggestions.put("Sellers", userSuggestions);
            } catch (Exception e) {
                log.error("Error fetching user suggestions: {}", e.getMessage(), e);
                suggestions.put("Sellers", List.of());
            }
        } else {
            suggestions.put("Sellers", List.of());
        }

        return suggestions;
    }
}
