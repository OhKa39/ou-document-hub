package ohka39.oudocumenthub.backend.components;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ohka39.oudocumenthub.backend.enums.EProvider;
import ohka39.oudocumenthub.backend.enums.ERole;
import ohka39.oudocumenthub.backend.models.Role;
import ohka39.oudocumenthub.backend.models.User;
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

	public void setSecurityContextHolder(OAuth2AuthenticationToken user) {
		Optional<User> alreadyUser = userRepository.findByEmail(user.getPrincipal().getAttribute("email"));
		if (alreadyUser.isEmpty()) {

			User newUser = User.builder()
					.email(user.getPrincipal().getAttribute("email"))
					.firstName(user.getPrincipal().getAttribute("name").toString().split(" ")[0])
					.lastName(user.getPrincipal().getAttribute("name").toString().split(" ")[1])
					.isEnable(true)
					.provider(EProvider.valueOf(user.getAuthorizedClientRegistrationId().toUpperCase()))
					.password(passwordEncoder.encode(UUID.randomUUID().toString()))
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

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {

		this.setDefaultTargetUrl(frontendUrl);
		this.setAlwaysUseDefaultTargetUrl(true);
		super.onAuthenticationSuccess(request, response, authentication);
		setSecurityContextHolder((OAuth2AuthenticationToken) authentication);
	}

}
