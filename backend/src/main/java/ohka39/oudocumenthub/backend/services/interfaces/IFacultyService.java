package ohka39.oudocumenthub.backend.services.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.payload.DTO.FacultyDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateFacultyRequest;

public interface IFacultyService {
    public FacultyDTO createFaculty(CreateFacultyRequest request);

    public Page<FacultyDTO> getFaculties(Pageable pageable);

    public FacultyDTO updateFaculty(String id, CreateFacultyRequest request);

    public void deleteFaculty(String id);
}
