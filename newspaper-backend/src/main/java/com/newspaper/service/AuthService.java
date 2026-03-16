package com.newspaper.service;

import com.newspaper.dto.AuthDto.*;
import com.newspaper.entity.User;
import com.newspaper.repository.UserRepository;
import com.newspaper.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.username());
        String token = jwtService.generateToken(userDetails);
        User user = userRepository.findByUsername(request.username()).orElseThrow();
        return new LoginResponse(token, user.getUsername(), user.getRole(), jwtService.getExpirationTime());
    }

    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            return new ApiResponse(false, "Username already exists");
        }
        userRepository.save(User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role("ADMIN")
                .build());
        return new ApiResponse(true, "Admin user created successfully");
    }
}
