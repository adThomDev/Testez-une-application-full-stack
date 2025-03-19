package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

  private MockMvc mockMvc;

  @Mock
  private SessionService sessionService;

  @Mock
  private SessionMapper sessionMapper;

  @InjectMocks
  private SessionController sessionController;

  private ObjectMapper objectMapper = new ObjectMapper();

  private Session session;
  private SessionDto sessionDto;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();

    session = new Session();
    session.setId(1L);
    session.setName("Test Session");

    sessionDto = new SessionDto();
    sessionDto.setId(1L);
    sessionDto.setName("Test Session");
  }

  @Test
  void testFindById_Success() throws Exception {
    when(sessionService.getById(1L)).thenReturn(session);
    when(sessionMapper.toDto(session)).thenReturn(sessionDto);

    mockMvc.perform(get("/api/session/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Test Session"));

    verify(sessionService, times(1)).getById(1L);
  }

  @Test
  void testFindById_NotFound() throws Exception {
    when(sessionService.getById(1L)).thenReturn(null);

    mockMvc.perform(get("/api/session/1"))
        .andExpect(status().isNotFound());

    verify(sessionService, times(1)).getById(1L);
  }

  @Test
  void testFindAllSessions() throws Exception {
    List<Session> sessions = Collections.singletonList(session);
    List<SessionDto> sessionDtos = Collections.singletonList(sessionDto);

    when(sessionService.findAll()).thenReturn(sessions);
    when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

    mockMvc.perform(get("/api/session"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(1));

    verify(sessionService, times(1)).findAll();
  }

  @Test
  void testCreateSession() throws Exception {
    sessionDto.setDate(new Date()); // Set required date
    sessionDto.setTeacher_id(1L);   // Set required teacher_id
    sessionDto.setDescription("Valid description"); // Required field

    when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
    when(sessionService.create(any(Session.class))).thenReturn(session);
    when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

    mockMvc.perform(post("/api/session")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Test Session"));

    verify(sessionService, times(1)).create(any(Session.class));
  }

  @Test
  void testUpdateSession() throws Exception {
    sessionDto.setDate(new Date()); // Set required date
    sessionDto.setTeacher_id(1L);   // Set required teacher_id
    sessionDto.setDescription("Valid description"); // Required field

    when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
    when(sessionService.update(eq(1L), any(Session.class))).thenReturn(session);
    when(sessionMapper.toDto(any(Session.class))).thenReturn(sessionDto);

    mockMvc.perform(put("/api/session/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(sessionDto)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Test Session"));

    verify(sessionService, times(1)).update(eq(1L), any(Session.class));
  }


  @Test
  void testDeleteSession() throws Exception {
    when(sessionService.getById(1L)).thenReturn(session);
    doNothing().when(sessionService).delete(1L);

    mockMvc.perform(delete("/api/session/1"))
        .andExpect(status().isOk());

    verify(sessionService, times(1)).delete(1L);
  }

  @Test
  void testParticipate() throws Exception {
    doNothing().when(sessionService).participate(1L, 1L);

    mockMvc.perform(post("/api/session/1/participate/1"))
        .andExpect(status().isOk());

    verify(sessionService, times(1)).participate(1L, 1L);
  }

  @Test
  void testNoLongerParticipate() throws Exception {
    doNothing().when(sessionService).noLongerParticipate(1L, 1L);

    mockMvc.perform(delete("/api/session/1/participate/1"))
        .andExpect(status().isOk());

    verify(sessionService, times(1)).noLongerParticipate(1L, 1L);
  }
}

