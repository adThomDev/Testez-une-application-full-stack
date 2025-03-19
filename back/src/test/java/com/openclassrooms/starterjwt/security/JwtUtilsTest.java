package com.openclassrooms.starterjwt.security;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.lang.reflect.Field;
import java.util.Date;

import io.jsonwebtoken.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

class JwtUtilsTest {

  private JwtUtils jwtUtils;

  @Mock
  private Authentication authentication;

  private final String jwtSecret = "testSecretKey";
  private final int jwtExpirationMs = 60000; //1min

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    jwtUtils = new JwtUtils();

    setPrivateField(jwtUtils, "jwtSecret", jwtSecret);
    setPrivateField(jwtUtils, "jwtExpirationMs", jwtExpirationMs);
  }

  @Test
  void testGenerateJwtToken() {
    UserDetailsImpl userDetails = new UserDetailsImpl(1L, "testUser", "First", "Last", false, "password");
    when(authentication.getPrincipal()).thenReturn(userDetails);

    String token = jwtUtils.generateJwtToken(authentication);

    assertNotNull(token);
    assertFalse(token.isEmpty());
  }

  @Test
  void testGetUserNameFromJwtToken() {
    String token = createTestToken("testUser");

    String username = jwtUtils.getUserNameFromJwtToken(token);
    assertEquals("testUser", username);
  }

  @Test
  void testValidateJwtToken_ValidToken() {
    String token = createTestToken("testUser");

    assertTrue(jwtUtils.validateJwtToken(token));
  }

  @Test
  void testValidateJwtToken_InvalidToken() {
    assertFalse(jwtUtils.validateJwtToken("invalidToken"));
  }

  @Test
  void testValidateJwtToken_ExpiredToken() {
    String expiredToken = createExpiredToken("testUser");

    assertFalse(jwtUtils.validateJwtToken(expiredToken));
  }

  private String createTestToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();
  }

  private String createExpiredToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date(System.currentTimeMillis() - 60000))
        .setExpiration(new Date(System.currentTimeMillis() - 30000))
        .signWith(SignatureAlgorithm.HS512, jwtSecret)
        .compact();
  }

  private void setPrivateField(Object target, String fieldName, Object value) {
    try {
      Field field = JwtUtils.class.getDeclaredField(fieldName);
      field.setAccessible(true);
      field.set(target, value);
    } catch (Exception e) {
      throw new RuntimeException("Failed to set private field", e);
    }
  }
}
