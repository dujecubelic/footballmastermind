package football_mastermind.opp.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.lang.NonNull;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Getter
@Setter
@Entity
@Table(name="users")
public class FootballMastermindUser {

	@Id
	@GeneratedValue
	@Column(name="user_id")
	private Long userId;
	
	@Column(unique=true, name="email")
	private String email;
	
	@Setter
    @Column(unique=true, name="username")
	@NonNull
	private String username;
	
	@Setter
    @Column(name="password")
	private String password;
	
	@Setter
    @Column(name="is_moderator")
	private Boolean isModerator;

	public FootballMastermindUser(String email, String username, String password, boolean isModerator) {
		super();
		this.email = email;
		this.username = username;
		this.password = password;
		this.isModerator = false;
	}
	
	public FootballMastermindUser(String email, String username) {
		super();
		this.email = email;
		this.username = username;
		this.password = null;
		this.isModerator = false;
	}

	//Spring ovo treba ali ne znam zašto
	public FootballMastermindUser() {
		super();
		this.email = null;
		this.username = null;
		this.password = null;
		this.isModerator = false;
	}


    @Override
	public String toString() {
		return "User [id=" + userId + ", email=" + email + ", username="
				+ username + "]";
	}
	
}
