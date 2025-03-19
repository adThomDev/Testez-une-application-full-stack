package com.openclassrooms.starterjwt.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserDetailsServiceImpl userDetailsService;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = User.builder()
        .id(1L)  // Optional if it's auto-generated
        .email("test@aze.com")
        .lastName("bob")
        .firstName("bobby")
        .password("password")
        .admin(false)
        .build();
  }

  @Test
  void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
    when(userRepository.findByEmail("test@aze.com")).thenReturn(Optional.of(testUser));

    UserDetails userDetails = userDetailsService.loadUserByUsername("test@aze.com");

    assertNotNull(userDetails);
    assertEquals("test@aze.com", userDetails.getUsername());
    assertEquals("password", userDetails.getPassword());
  }

  @Test
  void loadUserByUsername_ShouldThrowException_WhenUserNotFound() {
    when(userRepository.findByEmail("unknown@aze.com")).thenReturn(Optional.empty());

    UsernameNotFoundException exception = assertThrows(
        UsernameNotFoundException.class,
        () -> userDetailsService.loadUserByUsername("unknown@aze.com")
    );

    assertEquals("User Not Found with email: unknown@aze.com", exception.getMessage());
  }
}

