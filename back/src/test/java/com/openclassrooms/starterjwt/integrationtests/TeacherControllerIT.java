package com.openclassrooms.starterjwt.integrationtests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@Rollback
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TeacherControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  private String jwtToken;

  @BeforeAll
  void setUpToken() throws Exception {
    jwtToken = obtainAccessToken("yoga@studio.com", "test!1234");
  }

  private String obtainAccessToken(String username, String password) throws Exception {
    String requestBody = String.format("{\"email\":\"%s\", \"password\":\"%s\"}", username, password);

    MvcResult result = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(requestBody))
        .andReturn();

    String responseBody = result.getResponse().getContentAsString();
    assertEquals(200, result.getResponse().getStatus(), "Login failed!");

    return objectMapper.readTree(responseBody).get("token").asText();
  }

  @Test
  void testFindById_Success() throws Exception {
    mockMvc.perform(get("/api/teacher/1")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.firstName").value("Margot"));
  }

  @Test
  void testFindById_NotFound() throws Exception {
    mockMvc.perform(get("/api/teacher/999")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testFindAllTeachers() throws Exception {
    mockMvc.perform(get("/api/teacher")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(2)));
  }
}
