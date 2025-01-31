package com.example.inventory_management.controller;


import com.example.inventory_management.model.User;
import com.example.inventory_management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.inventory_management.dto.LoginRequest;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest loginRequest) {
        // Assuming you have a UserService for authentication
        boolean isAuthenticated = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (isAuthenticated) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("message", "Invalid credentials"));
        }
    }
    @GetMapping("/login")
    public String login() {
        return "login"; // This should return the name of your login view (e.g., login.html)
    }
}