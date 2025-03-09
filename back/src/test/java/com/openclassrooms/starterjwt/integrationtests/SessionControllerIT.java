package com.openclassrooms.starterjwt.integrationtests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
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

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@Rollback
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SessionControllerIT {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  private String jwtToken;

  private Session session;
  private SessionDto sessionDto;

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
//    System.out.println("Login response: " + responseBody);
    int status = result.getResponse().getStatus();
//    System.out.println("Login response status: " + status);
    assertEquals(200, status, "Login failed!");

    return objectMapper.readTree(responseBody).get("token").asText();
  }

  private SessionDto createTestSession() throws Exception {
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("sessionTest");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(1L);
    sessionDto.setDescription("Description");

    String responseJson = mockMvc.perform(post("/api/session")
            .header("Authorization", "Bearer " + jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

    return objectMapper.readValue(responseJson, SessionDto.class);
  }

  @BeforeEach
  void setUp() {
    session = new Session();
    session.setId(1L);
    session.setName("sessionTest");

    sessionDto = new SessionDto();
    sessionDto.setId(1L);
    sessionDto.setName("sessionTest");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(1L);
    sessionDto.setDescription("Description");
  }

  @Test
  void testFindById_Success() throws Exception {
    SessionDto createdSession = createTestSession();

    mockMvc.perform(get("/api/session/" + createdSession.getId())
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(createdSession.getId()))
        .andExpect(jsonPath("$.name").value("sessionTest"));
  }


  @Test
  void testFindById_NotFound() throws Exception {
    mockMvc.perform(get("/api/session/999")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isNotFound());
  }

  @Test
  void testFindAllSessions() throws Exception {
    createTestSession();
    mockMvc.perform(get("/api/session")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1));
  }

  @Test
  void testCreateSession() throws Exception {
    SessionDto sessionDto = new SessionDto();
    sessionDto.setName("sessionTest");
    sessionDto.setDate(new Date());
    sessionDto.setTeacher_id(1L);
    sessionDto.setDescription("Description");

    String responseJson = mockMvc.perform(post("/api/session")
            .header("Authorization", "Bearer " + jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

    SessionDto createdSession = objectMapper.readValue(responseJson, SessionDto.class);

    assertNotNull(createdSession.getId());
    assertEquals("sessionTest", createdSession.getName());
  }


  @Test
  void testUpdateSession() throws Exception {
    SessionDto createdSession = createTestSession();
    createdSession.setDescription("Description2");

    String responseJson = mockMvc.perform(put("/api/session/" + createdSession.getId())
            .header("Authorization", "Bearer " + jwtToken)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(createdSession)))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

    SessionDto updatedSession = objectMapper.readValue(responseJson, SessionDto.class);

    assertEquals("Description2", updatedSession.getDescription());
  }


  @Test
  void testDeleteSession() throws Exception {
    SessionDto createdSession = createTestSession();

    mockMvc.perform(delete("/api/session/" + createdSession.getId())
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk());
  }


  @Test
  void testParticipate() throws Exception {
    SessionDto createdSession = createTestSession();

    mockMvc.perform(post("/api/session/" + createdSession.getId() + "/participate/1")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk());
  }

  @Test
  void testNoLongerParticipate() throws Exception {
    SessionDto createdSession = createTestSession();

    mockMvc.perform(post("/api/session/" + createdSession.getId() + "/participate/1")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk());

    mockMvc.perform(delete("/api/session/" + createdSession.getId() + "/participate/1")
            .header("Authorization", "Bearer " + jwtToken))
        .andExpect(status().isOk());
  }
}

