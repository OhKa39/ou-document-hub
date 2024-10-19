package ohka39.oudocumenthub.backend.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.payload.DTO.FacultyDTO;
import ohka39.oudocumenthub.backend.payload.DTO.ResponseDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateFacultyRequest;
import ohka39.oudocumenthub.backend.services.interfaces.IFacultyService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/${api-route}/faculties")
@Slf4j
public class FacultyController {
    private final IFacultyService facultyService;

    // @PreAuthorize("hasRole('ROLE_GODADMIN') or hasRole('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<ResponseDTO> createFaculty(@RequestBody @Valid CreateFacultyRequest request) {
        log.info("faculty request:{}", request.getFacultyName());
        FacultyDTO data = facultyService.createFaculty(request);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.CREATED.value(), data,
                "create faculty successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // @PreAuthorize("hasAuthority('GODADMIN')")
    @GetMapping
    public ResponseEntity<ResponseDTO> retrieveFaculty(Pageable pageable) {
        Page<FacultyDTO> data = facultyService.getFaculties(pageable);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), data,
                "retrieve faculty successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    // @PreAuthorize("hasRole('GODADMIN') or hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<ResponseDTO> updateFaculty(@PathVariable("id") String id,
            @RequestBody @Valid CreateFacultyRequest request) {
        FacultyDTO data = facultyService.updateFaculty(id, request);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.OK.value(), data,
                "update faculty successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseDTO> deleteFaculty(@PathVariable("id") String id) {
        facultyService.deleteFaculty(id);
        ResponseDTO response = new ResponseDTO("success", HttpStatus.NO_CONTENT.value(), null,
                "delete faculty successfully");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }
}
