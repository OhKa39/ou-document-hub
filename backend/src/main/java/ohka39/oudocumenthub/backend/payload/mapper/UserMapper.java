package ohka39.oudocumenthub.backend.payload.mapper;

import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;

@Component
@RequiredArgsConstructor
public class UserMapper {
    private final ModelMapper modelMapper;

    private final PasswordEncoder passwordEncoder;

    public User toUser(SignUpRequest user, Set<Role> roles, EProvider provider) {
        User temp = modelMapper.map(user, User.class);
        temp.setRoles(roles);
        temp.setPassword(passwordEncoder.encode(user.getPassword()));
        temp.setProvider(provider);
        temp.setAvatarLink("/default-avatar-2.png");
        return temp;
    }

    public User toUser(User oldUser, SignUpRequest newUser) {
        User temp = modelMapper.map(oldUser, User.class);
        temp.setFirstName(newUser.getFirstName());
        temp.setLastName(newUser.getLastName());
        temp.setPassword(passwordEncoder.encode(newUser.getPassword()));
        temp.setEmail(newUser.getEmail());
        temp.setGender(newUser.getGender());
        temp.setDateOfBirth(newUser.getDateOfBirth());
        temp.setAvatarLink("/default-avatar-2.png");
        return temp;
    }

    public UserDTO toUserDTO(User user) {
        UserDTO temp = modelMapper.map(user, UserDTO.class);
        temp.setRoles(user.getRoles().stream().map(Role::getName).map(Object::toString).toList());
        return temp;
    }
}
