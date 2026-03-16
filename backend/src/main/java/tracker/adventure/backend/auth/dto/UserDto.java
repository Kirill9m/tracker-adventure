package tracker.adventure.backend.auth.dto;

import tracker.adventure.backend.auth.model.User;

public record UserDto(
        String id,
        String name,
        String email,
        String githubLogin,
        String avatarUrl) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getGithubLogin(),
                user.getAvatarUrl());
    }
}