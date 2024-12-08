package ohka39.oudocumenthub.backend.components;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.JdbcOAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EGender;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.GoogleInformation;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.GoogleInformation.Birthday;
import ohka39.oudocumenthub.backend.payload.ResponseWebClient.GoogleInformation.Gender;
import ohka39.oudocumenthub.backend.repositories.RoleRepository;
import ohka39.oudocumenthub.backend.repositories.UserRepository;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomOauth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	@Value("${frontend.url}")
	private String frontendUrl;

	private final UserRepository userRepository;

	private final RoleRepository roleRepository;

	private final PasswordEncoder passwordEncoder;

	@Autowired
	private final JdbcOAuth2AuthorizedClientService authorizedClientService;

	public void setSecurityContextHolder(Authentication auth) {

		OAuth2AuthenticationToken user = (OAuth2AuthenticationToken) auth;

		Map<Object, Object> test = getGoogleInformation(auth);
		log.info("test obj: {}", test);

		Optional<User> alreadyUser = userRepository.findByEmail(user.getPrincipal().getAttribute("email"));
		if (alreadyUser.isEmpty()) {

			User newUser = User.builder()
					.email(user.getPrincipal().getAttribute("email"))
					.firstName(user.getPrincipal().getAttribute("name").toString().split(" ")[0])
					.lastName(user.getPrincipal().getAttribute("name").toString().split(" ")[1])
					.isEnable(true)
					.provider(EProvider.valueOf(user.getAuthorizedClientRegistrationId().toUpperCase()))
					.password(passwordEncoder.encode(UUID.randomUUID().toString()))
					.gender(EGender.valueOf(test.get("gender").toString()))
					.dateOfBirth(
							LocalDate.parse(test.get("dob").toString(), DateTimeFormatter.ofPattern("yyyy-M-d")))
					.avatarLink(test.get("picture").toString())
					.build();

			Role userRole = roleRepository.findByName(ERole.ROLE_USER);
			newUser.setRoles(new HashSet<>(Arrays.asList(userRole)));

			User saveUser = userRepository.save(newUser);
			Map<String, Object> attr = new HashMap<>();
			attr.put("userId", saveUser.getUserId());
			attr.put("email", saveUser.getEmail());
			attr.put("provider", saveUser.getProvider());

			List<GrantedAuthority> authorities = new ArrayList<>(saveUser.getRoles().stream()
					.map((role) -> new SimpleGrantedAuthority(role.getName().toString())).toList());
			DefaultOAuth2User oauth2User = new DefaultOAuth2User(
					authorities,
					attr,
					"userId");

			SecurityContextHolder securityContextHolder = new SecurityContextHolder();
			securityContextHolder.getContext().setAuthentication(new OAuth2AuthenticationToken(oauth2User,
					authorities, user.getAuthorizedClientRegistrationId()));
		} else {
			alreadyUser.get().setEnable(true);
			userRepository.save(alreadyUser.get());
			Map<String, Object> attr = new HashMap<>();
			attr.put("userId", alreadyUser.get().getUserId());
			attr.put("email", alreadyUser.get().getEmail());
			attr.put("provider", alreadyUser.get().getProvider());
			List<GrantedAuthority> authorities = new ArrayList<>(alreadyUser.get().getRoles().stream()
					.map((role) -> new SimpleGrantedAuthority(role.getName().toString())).toList());
			DefaultOAuth2User oauth2User = new DefaultOAuth2User(
					authorities,
					attr,
					"userId");

			SecurityContextHolder securityContextHolder = new SecurityContextHolder();
			securityContextHolder.getContext().setAuthentication(new OAuth2AuthenticationToken(oauth2User,
					authorities, user.getAuthorizedClientRegistrationId()));
		}
	}

	private String decodeAccessToken(String encodedToken) {
		// Remove the leading backslash if present
		if (encodedToken.startsWith("\\x")) {
			encodedToken = encodedToken.substring(2);
		}

		// Decode the hex string
		byte[] decodedBytes = new BigInteger(encodedToken, 16).toByteArray();

		// Convert decoded bytes to a string
		return new String(decodedBytes, StandardCharsets.UTF_8);
	}

	// public Map<Map, Map> fetchAdditionalInformation(Authentication auth) {
	// return null;
	// }

	public Map<Object, Object> getGoogleInformation(Authentication auth)
			throws SecurityException {
		log.info("auth name:{}", auth.getName());
		OAuth2AuthorizedClient authorizedClient = authorizedClientService.loadAuthorizedClient("google",
				auth.getName());

		String token = decodeAccessToken(authorizedClient.getAccessToken().getTokenValue());
		log.info("user: {}", token);

		WebClient client = WebClient
				.create();
		GoogleInformation res = client.get()
				.uri("https://people.googleapis.com/v1/people/me?personFields=birthdays,genders")
				.header("Authorization", String.format("Bearer %s", token))
				.retrieve().bodyToMono(GoogleInformation.class).block();
		log.info("obj: {}", res);

		List<Birthday> dob = res.getBirthdays().stream()
				.filter(ele -> "ACCOUNT".equals(ele.getMetadata().getSource().getType())).toList();
		List<Gender> gender = res.getGenders().stream()
				.filter(ele -> "PROFILE".equals(ele.getMetadata().getSource().getType())).toList();
		log.info("gender {}", gender);
		Map<Object, Object> converter = new HashMap<>();
		converter.put("gender", gender.get(0).getFormattedValue().toString());
		converter.put("dob", dob.get(0).getDate().toString());
		converter.put("picture", ((OAuth2AuthenticationToken) auth).getPrincipal().getAttribute("picture"));

		return converter;
	}

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		this.setDefaultTargetUrl(frontendUrl);
		this.setAlwaysUseDefaultTargetUrl(true);
		super.onAuthenticationSuccess(request, response, authentication);
		setSecurityContextHolder(authentication);
	}

}
