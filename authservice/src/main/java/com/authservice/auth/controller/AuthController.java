package com.authservice.auth.controller;
import com.authservice.auth.model.User;
import com.authservice.auth.request.SignupRequest;
import com.authservice.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }
    
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        userRepository.save(user);
    
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignupRequest loginRequest) {
        User existingUser = userRepository.findByUsername(loginRequest.getUsername());
        if (existingUser != null) {
            if (passwordEncoder.matches(loginRequest.getPassword(), existingUser.getPassword())) {
                return ResponseEntity.ok("User authenticated");
            } else {
                System.out.println("Failed to login. Check your credentials and try again.");
            }
        } else {
            System.out.println("No user found with username: " + loginRequest.getUsername());
        }
        return ResponseEntity.status(401).body(Collections.singletonMap("error", "Invalid credentials"));
    }
}
