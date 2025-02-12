package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private UserService userService;

  private User testUser;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId(1L);
    testUser.setEmail("test@example.com");
    testUser.setLastName("Doe");
  }

  @Test
  void testFindById_UserExists() {
    // Given
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

    // When
    User result = userService.findById(1L);

    // Then
    assertNotNull(result);
    assertEquals(testUser.getId(), result.getId());
    assertEquals(testUser.getEmail(), result.getEmail());
    verify(userRepository, times(1)).findById(1L);
  }

  @Test
  void testFindById_UserNotFound() {
    // Given
    when(userRepository.findById(2L)).thenReturn(Optional.empty());

    // When
    User result = userService.findById(2L);

    // Then
    assertNull(result);
    verify(userRepository, times(1)).findById(2L);
  }

  @Test
  void testDelete() {
    // Given
    Long userId = 1L;
    doNothing().when(userRepository).deleteById(userId);

    // When
    userService.delete(userId);

    // Then
    verify(userRepository, times(1)).deleteById(userId);
  }
}

