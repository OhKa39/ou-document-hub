package ohka39.oudocumenthub.backend.services.impl;

import java.io.IOException;
import java.net.URL;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.events.OnDeleteFile;
import ohka39.oudocumenthub.backend.events.OnUploadFile;
import ohka39.oudocumenthub.backend.exceptions.EntityAlreadyExistsException;
import ohka39.oudocumenthub.backend.exceptions.EntityNotFoundException;
import ohka39.oudocumenthub.backend.exceptions.FileIsEmptyException;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.DTO.UserDTO;
import ohka39.oudocumenthub.backend.payload.mapper.UserMapper;
import ohka39.oudocumenthub.backend.payload.requests.EditNameRequest;
import ohka39.oudocumenthub.backend.payload.requests.SignUpRequest;
import ohka39.oudocumenthub.backend.repositories.RoleRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;
import ohka39.oudocumenthub.backend.services.interfaces.IUserService;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImpl implements IUserService, UserDetailsManager {

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserMapper userMapper;

    private final AmazonS3 s3Client;

    private final ApplicationEventPublisher eventPublisher;

    @Value("${aws.s3.bucket-name}")
    private String BUCKET_NAME;

    private final String FOLDER_S3_LOCATION = "user-avatar-images/";

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
        return userMapper.toCurrentUserDTO(newUser);

    }

    @Override
    @Cacheable(value = "users", key = "#userId")
    public UserDTO getUserById(String userId) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> {
            throw new EntityNotFoundException(userId, 1000);
        });

        return userMapper.toCurrentUserDTO(user);
    }

    @Override
    @CachePut(value = "users", key = "#userId")
    public UserDTO setNameById(String userId, EditNameRequest request) {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("user with not found", 1000);
                });
        user.setLastName(request.getLastName());
        user.setFirstName(request.getFirstName());
        userRepository.saveAndFlush(user);
        return userMapper.toCurrentUserDTO(user);
    }

    @Override
    @CachePut(value = "users", key = "#userId")
    public UserDTO setAvatarById(String userId, MultipartFile request) throws IOException {
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> {
                    throw new EntityNotFoundException("user not found", 1000);
                });
        log.info("image: {}", request);
        String randomFileName = UUID.randomUUID().toString();
        eventPublisher.publishEvent(new OnUploadFile(FOLDER_S3_LOCATION + randomFileName, request));

        log.info("url remove: {}", user.getAvatarLink().split(FOLDER_S3_LOCATION)[1]);
        if (!user.getAvatarLink().contains("/default-avatar-1.webp"))
            eventPublisher.publishEvent(
                    new OnDeleteFile(FOLDER_S3_LOCATION + user.getAvatarLink().split(FOLDER_S3_LOCATION)[1]));

        URL url = s3Client.getUrl(BUCKET_NAME, FOLDER_S3_LOCATION + randomFileName);
        log.info("url: {}", url.toExternalForm());
        user.setAvatarLink(url.toExternalForm());
        userRepository.saveAndFlush(user);
        return userMapper.toCurrentUserDTO(user);
    }

    @Override
    public List<UserDTO> getUserList() {
        List<User> users = userRepository.findAll();
        List<UserDTO> usersDTO = users.stream().map(item -> userMapper.toAdminUserDTO(item)).toList();
        return usersDTO;
    }
}
