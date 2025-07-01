package football_mastermind.opp.sec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
@EnableWebSecurity
public class WebSecurityConfig implements WebMvcConfigurer {

	private UsernamePasswordService usernamePasswordService;
	private OAuth2Service oAuth2Service;
	private PasswordEncoder passwordEncoder;
	private ClientRegistrationRepository clientRegistrationRepository;

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
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.authorizeHttpRequests(authorizeRequests -> authorizeRequests
						// Allow API endpoints
						.requestMatchers("/api/auth/**").permitAll()
						.requestMatchers("/api/**").permitAll()
						.requestMatchers("/api/health").permitAll()

						// Allow Next.js static files
						.requestMatchers("/_next/**").permitAll()
						.requestMatchers("/static/**").permitAll()

						// Allow root files
						.requestMatchers("/", "/index.html", "/favicon.ico", "/robots.txt", "/manifest.json").permitAll()
						.requestMatchers("/*.js", "/*.css", "/*.map", "/*.json").permitAll()

						// Allow all frontend routes (SPA routing)
						.requestMatchers("/login", "/register", "/games", "/games/**", "/profile", "/profile/**").permitAll()

						// Allow images and assets
						.requestMatchers("/images/**", "/assets/**").permitAll()

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
		configuration.setAllowedOriginPatterns(Arrays.asList("*")); // More permissive for development
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);

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
		// Serve Next.js static files with highest priority
		registry.addResourceHandler("/_next/**")
				.addResourceLocations("classpath:/static/_next/")
				.setCachePeriod(31556926); // 1 year cache

		// Serve other static assets
		registry.addResourceHandler("/static/**")
				.addResourceLocations("classpath:/static/static/")
				.setCachePeriod(31556926);

		// Serve root files (favicon, robots.txt, etc.)
		registry.addResourceHandler("/favicon.ico", "/robots.txt", "/manifest.json")
				.addResourceLocations("classpath:/static/")
				.setCachePeriod(86400); // 1 day cache

		// Serve all other files with SPA fallback
		registry.addResourceHandler("/**")
				.addResourceLocations("classpath:/static/")
				.setCachePeriod(0); // No cache for HTML files
	}

	@Controller
	public static class FrontendController {

		@RequestMapping(value = {
				"/",
				"/login",
				"/register",
				"/games",
				"/games/**",
				"/profile",
				"/profile/**"
		})
		public String index() {
			System.out.println("Serving SPA route - forwarding to index.html");
			return "forward:/index.html";
		}
	}
}