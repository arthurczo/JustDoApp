package br.com.justdocompany.justdoitapp.service;

import br.com.justdocompany.justdoitapp.dto.AuthRequest;
import br.com.justdocompany.justdoitapp.dto.AuthResponse;
import br.com.justdocompany.justdoitapp.model.User;
import br.com.justdocompany.justdoitapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(AuthRequest request) {
        // Verificar se usuário já existe
        if (repository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Usuário já existe");
        }

        var user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            var user = repository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            var jwtToken = jwtService.generateToken(user);
            return new AuthResponse(jwtToken);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Credenciais inválidas");
        }
    }
}