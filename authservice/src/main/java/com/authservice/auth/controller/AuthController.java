package com.authservice.auth.controller;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
import com.authservice.auth.model.User;
import com.authservice.auth.request.SignupRequest;
import com.authservice.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Unable to process request. Please check your input.");
        }

        // Map SignupRequest to User entity
        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody SignupRequest loginRequest) {
        User existingUser = userRepository.findByUsername(loginRequest.getUsername());

        if (existingUser != null && passwordEncoder.matches(loginRequest.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.ok("User authenticated");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
