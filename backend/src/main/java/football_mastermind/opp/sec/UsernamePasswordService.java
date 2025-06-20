package football_mastermind.opp.sec;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import football_mastermind.opp.dao.UserRepository;
import football_mastermind.opp.domain.FootballMastermindUser;

@Service
public class UsernamePasswordService implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;

	/*
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		FootballMastermindUser user = userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(
				"No user with username " + username));
		
		List<GrantedAuthority> authorities = new ArrayList<>();
		authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
		if (user.getIsModerator()) {
			authorities.add(new SimpleGrantedAuthority("ROLE_MODERATOR"));
		}
		
		return new User(username, user.getPassword(), authorities);
	}
	*/

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		FootballMastermindUser user = userRepo.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		return new org.springframework.security.core.userdetails.User(
				user.getUsername(),
				user.getPassword(),
				List.of() // You can add roles/authorities if needed
		);
	}

	public Long getCurrentUserId() {
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
		Long userId = null;

		if (userRepo.findByUsername(username).isPresent()) {
			userId = userRepo.findByUsername(username).get().getUserId();
		} else {
			System.out.println("User not found");
		}

		return userId;
	}

}
