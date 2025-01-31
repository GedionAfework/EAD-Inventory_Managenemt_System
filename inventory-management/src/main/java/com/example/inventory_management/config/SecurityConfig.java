package com.example.inventory_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for simplicity
                .authorizeHttpRequests(auth -> auth
                        // Allow access to static files under /frontend/** without authentication
                        .requestMatchers("/frontend/**").permitAll()
                        // Allow public access to auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        // Allow public access to the /api/items endpoint for testing
                        .requestMatchers("/api/items").permitAll()
                        // Allow access to the login page
                        .requestMatchers("/login").permitAll()
                        // Protect all other endpoints
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login") // Specify a custom login page
                        .defaultSuccessUrl("/frontend/Html/index.html", true) // Redirect after successful login
                        .failureUrl("/login?error=true") // Redirect on login failure
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout") // URL for logging out
                        .logoutSuccessUrl("/login?logout") // Redirect after logout
                        .permitAll()
                )
                .httpBasic(httpBasic -> httpBasic.disable()); // Explicitly disable basic authentication if not used

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}