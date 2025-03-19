package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

  @Mock
  private UserService userService;

  @Mock
  private UserMapper userMapper;

  @Mock
  private UserDetails userDetails;

  @Mock
  private SecurityContext securityContext;

  @Mock
  private Authentication authentication;

  @InjectMocks
  private UserController userController;

  private User mockUser;

  @BeforeEach
  void setUp() {
    mockUser = new User();
    mockUser.setId(1L);
    mockUser.setEmail("test@aze.com");
  }

  @Test
  void testFindById_Success() {
    when(userService.findById(1L)).thenReturn(mockUser);
    UserDto mockUserDto = new UserDto(1L, "test@aze.com", "bob", "bobby", false, null, null, null);
    when(userMapper.toDto(mockUser)).thenReturn(mockUserDto);

    ResponseEntity<?> response = userController.findById("1");

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
  }

  @Test
  void testFindById_NotFound() {
    when(userService.findById(1L)).thenReturn(null);

    ResponseEntity<?> response = userController.findById("1");

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }

  @Test
  void testFindById_BadRequest() {
    ResponseEntity<?> response = userController.findById("invalid");

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
  }

  @Test
  void testDeleteUser_Success() {
    when(userService.findById(1L)).thenReturn(mockUser);
    when(authentication.getPrincipal()).thenReturn(userDetails);
    when(userDetails.getUsername()).thenReturn("test@aze.com");
    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);

    ResponseEntity<?> response = userController.save("1");

    assertEquals(HttpStatus.OK, response.getStatusCode());
    verify(userService, times(1)).delete(1L);
  }

  @Test
  void testDeleteUser_Unauthorized() {
    when(userService.findById(1L)).thenReturn(mockUser);
    when(authentication.getPrincipal()).thenReturn(userDetails);
    when(userDetails.getUsername()).thenReturn("other@aze.com");
    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);

    ResponseEntity<?> response = userController.save("1");

    assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    verify(userService, never()).delete(1L);
  }

  @Test
  void testDeleteUser_NotFound() {
    when(userService.findById(1L)).thenReturn(null);

    ResponseEntity<?> response = userController.save("1");

    assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
  }

  @Test
  void testDeleteUser_BadRequest() {
    ResponseEntity<?> response = userController.save("invalid");

    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
  }
}

