package ohka39.oudocumenthub.backend.services;

import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;

public interface IUserService {

    public UserDTO registerNewUserAccount(SignUpRequest user);

    public UserDTO getUserById(String userId);

}
