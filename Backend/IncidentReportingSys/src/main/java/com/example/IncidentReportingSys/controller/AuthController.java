package com.example.IncidentReportingSys.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.example.IncidentReportingSys.Config.JwtUtil;
import com.example.IncidentReportingSys.model.AuthRequest;
import com.example.IncidentReportingSys.model.User;
import com.example.IncidentReportingSys.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
// @CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Authentication", description = "Endpoints for user login")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Operation(summary = "Login user", description = "Authenticate a user and return a JWT token")
    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        // Fetch user from DB
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null)
            throw new RuntimeException("User not found");

        // Generate JWT using actual role from DB
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId());

        return token;
    }
}