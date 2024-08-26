package ohka39.oudocumenthub.backend.services;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.exceptions.User.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.models.RegisterToken;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.requests.UserRequest;
import ohka39.oudocumenthub.backend.payload.responses.UserResponse;
import ohka39.oudocumenthub.backend.repositories.RegisterTokenRepository;
import ohka39.oudocumenthub.backend.repositories.RoleRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements IUserService{

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final RegisterTokenRepository registerTokenRepository;

    @Override
    public String createVerificationToken(String userEmail){
        RegisterToken tokenInstance = new RegisterToken();
        tokenInstance.setEmail(userEmail);
        return registerTokenRepository.save(tokenInstance).getRegisterTokenId();
    }

    @Override
    public UserResponse registerNewUserAccount(UserRequest user){
        Optional<User> isExists = userRepository.findByEmail(user.getEmail());

        if(isExists.isPresent())
            throw new EntityAlreadyExistsException("User with this email already exists.");
        
        User newUser = User.builder()
            .email(user.getEmail())
            .gender(user.getGender())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .password(user.getPassword())
            .dateOfBirth(user.getDateOfBirth())
            .build();

        Role userRole = roleRepository.findByName(ERole.ROLE_USER);
        newUser.setRoles(new HashSet<>(Arrays.asList(userRole)));

        User saveUser = userRepository.save(newUser);

        return UserResponse
            .builder()
            .email(saveUser.getEmail())
            .gender(saveUser.getGender())
            .firstName(saveUser.getFirstName())
            .lastName(saveUser.getLastName())
            .dateOfBirth(saveUser.getDateOfBirth())
            .createdAt(saveUser.getCreatedAt())
            .build();
    }
}
