package ohka39.oudocumenthub.backend.services.interfaces;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.requests.EditNameRequest;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;

public interface IUserService {

    public UserDTO registerNewUserAccount(SignUpRequest user);

    public UserDTO getUserById(String userId);

    public UserDTO setNameById(String userId, EditNameRequest request);

    public UserDTO setAvatarById(String userId, MultipartFile request) throws IOException;

    public List<UserDTO> getUserList();

}
