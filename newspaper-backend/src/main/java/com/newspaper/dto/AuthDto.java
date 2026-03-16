package com.newspaper.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthDto {

    public record LoginRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record LoginResponse(
            String token,
            String username,
            String role,
            long expiresIn
    ) {}

    public record RegisterRequest(
            @NotBlank(message = "Username is required") String username,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record ApiResponse(
            boolean success,
            String message
    ) {}
}
