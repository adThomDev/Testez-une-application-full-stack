package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

  @Mock
  private AuthenticationManager authenticationManager;

  @Mock
  private JwtUtils jwtUtils;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private UserRepository userRepository;

  @Mock
  private Authentication authentication;

  @InjectMocks
  private AuthController authController;

  private User mockUser;
  private UserDetailsImpl mockUserDetails;

  @BeforeEach
  void setUp() {
    mockUser = new User("test@aze.com", "bobby", "bob", "encodedPassword", false);
    mockUserDetails = new UserDetailsImpl(1L, "test@aze.com", "bob", "bobby", false, "encodedPassword");
  }

  @Test
  void testAuthenticateUser_Success() {
    LoginRequest loginRequest = new LoginRequest();
    loginRequest.setEmail("test@aze.com");
    loginRequest.setPassword("password");

    when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
    when(authentication.getPrincipal()).thenReturn(mockUserDetails);
    when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockJwtToken");
    when(userRepository.findByEmail(mockUserDetails.getUsername())).thenReturn(Optional.of(mockUser));

    ResponseEntity<?> response = authController.authenticateUser(loginRequest);

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody() instanceof JwtResponse);
  }

  @Test
  void testRegisterUser_Success() {
    SignupRequest signupRequest = new SignupRequest();
    signupRequest.setEmail("newuser@aze.com");
    signupRequest.setFirstName("machin");
    signupRequest.setLastName("truc");
    signupRequest.setPassword("password");

    when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);
    when(passwordEncoder.encode(signupRequest.getPassword())).thenReturn("encodedPassword");

    ResponseEntity<?> response = authController.registerUser(signupRequest);

    assertEquals(200, response.getStatusCodeValue());
    assertTrue(response.getBody() instanceof MessageResponse);
    assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());
  }

  @Test
  void testRegisterUser_EmailAlreadyExists() {
    SignupRequest signupRequest = new SignupRequest();
    signupRequest.setEmail("test@aze.com");
    signupRequest.setFirstName("machin");
    signupRequest.setLastName("truc");
    signupRequest.setPassword("password");

    when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);

    ResponseEntity<?> response = authController.registerUser(signupRequest);

    assertEquals(400, response.getStatusCodeValue());
    assertTrue(response.getBody() instanceof MessageResponse);
    assertEquals("Error: Email is already taken!", ((MessageResponse) response.getBody()).getMessage());
  }
}

