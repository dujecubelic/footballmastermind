package football_mastermind.opp.sec;

import java.util.Objects;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;

@Configuration
public class ClientRegistrationConfig {

	@Bean
	public ClientRegistrationRepository clientRegistrationRepository() {
		return new InMemoryClientRegistrationRepository(this.googleClientRegistration());
	}

	private ClientRegistration googleClientRegistration() {
		return ClientRegistration.withRegistrationId("google").clientId(this.getClientID("google"))
				.clientSecret(this.getClientSecret("google"))
				.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
				.authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
				.redirectUri("{baseUrl}/login/oauth2/code/{registrationId}").scope("profile", "email") // openid NI POD
				// KOJU CIJENU
				// ne smije tu
				// biti
				.authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
				.tokenUri("https://www.googleapis.com/oauth2/v4/token")
				.userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
				.userNameAttributeName(IdTokenClaimNames.SUB).jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
				.clientName("Google").build();
	}

	private String getClientID(String provider) {
		String ID = "not found"; //nisam baš siguran postoji li bolje rješenje za ovo, ali return mora biti izvan try bloka
		try {
			if (Objects.equals(provider, "google")) {
				ID = System.getenv("GOOGLE_ID");
			} else {
				throw new Exception("unknown provider");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return ID;
	}

	private String getClientSecret(String provider) {
		String secret = "not found";
		try {
			if (Objects.equals(provider, "google")) {
				secret = System.getenv("GOOGLE_SECRET");
			} else {
				throw new Exception("unknown provider");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return secret;
	}

}