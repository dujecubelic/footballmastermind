package football_mastermind.opp.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class HomeController {

	@GetMapping({"/", "/login", "/register", "/profile", "/games", "/games/**"})
	public String home() {
		return "forward:/index.html";
	}

}