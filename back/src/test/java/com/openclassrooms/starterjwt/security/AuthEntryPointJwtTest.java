package com.openclassrooms.starterjwt.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthEntryPointJwtTest {

  private AuthEntryPointJwt authEntryPointJwt;
  private HttpServletRequest request;
  private HttpServletResponse response;
  private AuthenticationException authException;
  private ByteArrayOutputStream outputStream;

  @BeforeEach
  void setUp() throws Exception {
    authEntryPointJwt = new AuthEntryPointJwt();
    request = mock(HttpServletRequest.class);
    response = mock(HttpServletResponse.class);
    authException = mock(AuthenticationException.class);
    outputStream = new ByteArrayOutputStream();

    when(request.getServletPath()).thenReturn("/api/test");

    when(response.getOutputStream()).thenReturn(new ServletOutputStream() {
      @Override
      public boolean isReady() {
        return true;
      }

      @Override
      public void setWriteListener(WriteListener writeListener) {
      }

      @Override
      public void write(int b) {
        outputStream.write(b);
      }
    });

    when(authException.getMessage()).thenReturn("Unauthorized access");
  }

  @Test
  void testShouldSetUnauthorizedResponse() throws Exception {
    authEntryPointJwt.commence(request, response, authException);

    verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
    verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

    ObjectMapper mapper = new ObjectMapper();
    Map<String, Object> expectedResponse = new HashMap<>();
    expectedResponse.put("status", HttpServletResponse.SC_UNAUTHORIZED);
    expectedResponse.put("error", "Unauthorized");
    expectedResponse.put("message", "Unauthorized access");
    expectedResponse.put("path", "/api/test");

    Map<String, Object> actualResponse = mapper.readValue(outputStream.toByteArray(), Map.class);

    assertEquals(expectedResponse, actualResponse);
  }
}

