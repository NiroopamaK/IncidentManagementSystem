package com.example.IncidentReportingSys.controller;

import com.example.IncidentReportingSys.model.User;
import com.example.IncidentReportingSys.model.UserType;
import com.example.IncidentReportingSys.repository.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
// @CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Users", description = "Endpoints for user management")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Operation(summary = "Get all users")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElse(null);
    }

    @Operation(summary = "Sign up a new user")
    @PostMapping("/signup")
    public User createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Operation(summary = "Update user details")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User userDetails) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null)
            return null;

        user.setUsername(userDetails.getUsername());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());
        return userRepository.save(user);
    }

    @Operation(summary = "Delete user by ID")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable int id) {
        userRepository.deleteById(id);
    }

    @Operation(summary = "Get users by role")
    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable UserType role) {
        return userRepository.findByRole(role);
    }
}