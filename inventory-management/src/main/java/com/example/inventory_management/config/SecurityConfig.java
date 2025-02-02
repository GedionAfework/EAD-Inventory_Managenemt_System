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
                .csrf(csrf -> csrf.disable()) // Disable CSRF for API calls
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/frontend/**").permitAll() // ✅ Allow static files
                        .requestMatchers("/api/auth/**").permitAll() // ✅ Allow authentication APIs
                        .requestMatchers("/api/items/**").permitAll() // ✅ Allow public API access
                        .requestMatchers("/login", "/logout").permitAll() // ✅ Ensure login/logout are accessible
                        .anyRequest().authenticated() // ✅ Protect all other routes
                )
                .formLogin(form -> form
                        .loginPage("/login") // ✅ Use login controller
                        .defaultSuccessUrl("/frontend/Html/index.html", false) // ✅ Prevent infinite loop
                        .failureUrl("/login?error=true")
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                .httpBasic(httpBasic -> httpBasic.disable()); // ✅ Disable basic authentication

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
