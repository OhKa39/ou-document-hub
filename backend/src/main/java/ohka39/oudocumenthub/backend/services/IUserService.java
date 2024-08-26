package ohka39.oudocumenthub.backend.services;

import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.requests.UserRequest;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;

public interface IUserService {

    public String createVerificationToken(String userEmail);

    public UserResponse registerNewUserAccount(UserRequest user);

}
