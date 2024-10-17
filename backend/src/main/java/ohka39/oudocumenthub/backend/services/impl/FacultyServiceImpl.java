package ohka39.oudocumenthub.backend.services.impl;

import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.exceptions.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Faculty;
import ohka39.oudocumenthub.backend.payload.DTO.FacultyDTO;
import ohka39.oudocumenthub.backend.payload.requests.CreateFacultyRequest;
import ohka39.oudocumenthub.backend.repositories.FacultyRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IFacultyService;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements IFacultyService {
    private final ModelMapper modelMapper;

    private final FacultyRepository facultyRepository;

    @Override
    public FacultyDTO createFaculty(CreateFacultyRequest request) {
        Optional<Faculty> faculty = facultyRepository.findByFacultyName(request.getFacultyName().toLowerCase());
        if (faculty.isPresent())
            throw new EntityAlreadyExistsException("faculty has already exists", 1003);

        Faculty save = Faculty.builder().facultyName(request.getFacultyName().toLowerCase()).build();
        facultyRepository.save(save);
        return modelMapper.map(save, FacultyDTO.class);
    }

    @Override
    public Page<FacultyDTO> getFaculties(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(item -> modelMapper.map(item, FacultyDTO.class));
    }

    @Override
    public FacultyDTO updateFaculty(String id, CreateFacultyRequest request) {
        Faculty faculty = facultyRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("faculty not found", 1004);
                });
        Optional<Faculty> isExist = facultyRepository.findByFacultyName(request.getFacultyName());
        if (isExist.isPresent())
            throw new EntityAlreadyExistsException("faculty has already exists", 1003);
        faculty.setFacultyName(request.getFacultyName());
        facultyRepository.saveAndFlush(faculty);
        return modelMapper.map(faculty, FacultyDTO.class);
    }

    @Override
    public void deleteFaculty(String id) {
        Faculty faculty = facultyRepository.findById(UUID.fromString(id))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("faculty not found", 1004);
                });
        facultyRepository.delete(faculty);
    }

}
