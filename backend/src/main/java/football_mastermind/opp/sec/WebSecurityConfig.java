package football_mastermind.opp.sec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebSecurityConfig implements WebMvcConfigurer {
	
	private UsernamePasswordService usernamePasswordService;
	private OAuth2Service oAuth2Service;
	private PasswordEncoder passwordEncoder;
	private ClientRegistrationRepository clientRegistrationRepository;
	
	// Supposed to be better than @Autowire ?
	public WebSecurityConfig(UsernamePasswordService usernamePasswordService,
			OAuth2Service oAuth2Service,
			PasswordEncoder passwordEncoder,
			ClientRegistrationRepository clientRegistrationRepository) {
		this.usernamePasswordService = usernamePasswordService;
		this.oAuth2Service = oAuth2Service;
		this.passwordEncoder = passwordEncoder;
		this.clientRegistrationRepository = clientRegistrationRepository;
	}
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
		.csrf(AbstractHttpConfigurer::disable)
		.authorizeHttpRequests(authorizeRequests -> authorizeRequests
				.requestMatchers("/api/auth/**").permitAll()
				.requestMatchers("/api/**").permitAll()
				// Allow frontend routes
				.requestMatchers("/profile", "/games/**").permitAll()
				// Allow static resources
				.requestMatchers("/", "/index.html", "/*.js", "/*.css", "/*.ico",
						"/_next/**", "/images/**", "/assets/**").permitAll()
				.anyRequest().authenticated())
		.oauth2Login(config -> config
				.clientRegistrationRepository(clientRegistrationRepository)
				.userInfoEndpoint(userInfo -> userInfo.userService(oAuth2Service))
				.successHandler(new SimpleUrlAuthenticationSuccessHandler("/mapRegistered")))
		.formLogin(config -> config
				.defaultSuccessUrl("/", true)
				.failureHandler(new LoginAuthenticationFailureHandler()))
		.logout(config -> config
				.logoutSuccessUrl("/"))
		.exceptionHandling(config -> config
				.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
				
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "https://footballmastermind.onrender.com"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public AuthenticationManager authenticationManager(
			AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/**")
				.addResourceLocations("classpath:/static/")
				.setCachePeriod(31556926);
	}

	@Controller
	public class FrontendController {

		@RequestMapping(value = {
				"/",
				"/games/**",
				"/profile/**",
				"/login/**"
		})
		public String index() {
			return "forward:/index.html";
		}
	}

}
