package ohka39.oudocumenthub.backend.services.impl;

import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.UUID;

import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.exceptions.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.mapper.UserMapper;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;
import ohka39.oudocumenthub.backend.repositories.RoleRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.IUserService;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements IUserService, UserDetailsManager {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserMapper userMapper;

    @Override
    public void createUser(UserDetails user) {
        userRepository.save((User) user);
    }

    @Override
    public void updateUser(UserDetails user) {

    }

    @Override
    public void deleteUser(String username) {

    }

    @Override
    public void changePassword(String oldPassword, String newPassword) {

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> isExists = userRepository.findByEmail(username);

        if (isExists.isEmpty()) {
            throw new UsernameNotFoundException(MessageFormat.format("user with email {0} not found", username));
        }

        return isExists.get();
    }

    @Override
    public boolean userExists(String username) {
        Optional<User> isExists = userRepository.findByEmail(username);
        return isExists.isPresent();
    }

    @Override
    public UserDTO registerNewUserAccount(SignUpRequest user) {
        Optional<User> retrieveUser = userRepository.findByEmail(user.getEmail());

        if (retrieveUser.isPresent() && retrieveUser.get().isEnable())
            throw new EntityAlreadyExistsException("user with this email already exists.", 1001);

        Role userRole = roleRepository.findByName(ERole.ROLE_USER);
        User newUser = retrieveUser.isPresent() ? userMapper.toUser(retrieveUser.get(), user)
                : userMapper.toUser(user, new HashSet<Role>(Arrays.asList(userRole)), EProvider.APP);
        createUser(newUser);

        // Perform the actual mapping
        return userMapper.toUserDTO(newUser);

    }

    @Override
    @Cacheable(value = "users")
    public UserDTO getUserById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> {
            throw new EntityNotFoundException(userId, 1000);
        });

        return userMapper.toUserDTO(user);
    }
}
