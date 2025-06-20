package football_mastermind.opp.sec;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;

@Service
public class OAuth2Service implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
		DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
		OAuth2User user = delegate.loadUser(userRequest);
		
		String name = user.getAttribute("given_name");
		String surname = user.getAttribute("family_name");
		String email = user.getAttribute("email");
		String username = name + surname;
		FootballMastermindUser newUser = new FootballMastermindUser(email, username);
		
		if (!userRepo.findByUsername(username).isPresent()) {
			userRepo.save(newUser);
		}
		
		List<GrantedAuthority> authorities = new ArrayList<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
		if (userRepo.findByUsername(username).isPresent() && 
				userRepo.findByUsername(username).get().getIsModerator()) {
			authorities.add(new SimpleGrantedAuthority("ROLE_MODERATOR"));
		}
		
		// Creating a new object identical to the previous one, but with authorities
		return new DefaultOAuth2User(authorities, user.getAttributes(), "email");
	}

}
