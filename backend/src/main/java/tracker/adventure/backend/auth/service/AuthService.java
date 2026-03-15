package tracker.adventure.backend.auth.service;

import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.auth.model.User;
import tracker.adventure.backend.auth.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public String loginWithGithub(OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String githubLogin = oAuth2User.getAttribute("login");
        String avatarUrl = oAuth2User.getAttribute("avatar_url");

        if (email == null) {
            email = githubLogin + "@github.local";
        }
        if (name == null) {
            name = githubLogin;
        }

        final String finalEmail = email;
        final String finalName = name;

        User user = userRepository.findByGithubLogin(githubLogin)
                .orElseGet(() -> createUser(finalEmail, finalName, githubLogin, avatarUrl));

        return jwtService.generateToken(user.getEmail());
    }

    private User createUser(String email, String name, String githubLogin, String avatarUrl) {
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setGithubLogin(githubLogin);
        user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }
}
