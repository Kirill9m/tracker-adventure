package tracker.adventure.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import tracker.adventure.backend.auth.filter.JwtAuthFilter;
import tracker.adventure.backend.auth.service.AuthService;
import tracker.adventure.backend.auth.service.JwtService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthService authService;
    private final JwtService jwtService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/error").permitAll()
                        .requestMatchers("/api/auth/**", "/api/github/webhook", "/error").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth -> oauth
                        .successHandler(oAuth2SuccessHandler()))
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler oAuth2SuccessHandler() {
        return (request, response, authentication) -> {
            try {
                System.out.println("=== SUCCESS HANDLER TRIGGERED ===");
                OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
                String token = authService.loginWithGithub(oAuth2User);
                System.out.println("Token: " + token);
                response.sendRedirect("http://localhost:5173/auth/callback?token=" + token);
            } catch (Exception e) {
                System.out.println("=== ERROR IN SUCCESS HANDLER ===");
                e.printStackTrace();
            }
        };
    }
}
