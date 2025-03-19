package com.openclassrooms.starterjwt.services;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

  @Mock
  private SessionRepository sessionRepository;

  @Mock
  private UserRepository userRepository;

  @InjectMocks
  private SessionService sessionService;

  private Session session;
  private User user;

  @BeforeEach
  void setUp() {
    session = new Session();
    session.setId(1L);
    session.setUsers(Collections.emptyList());

    user = new User();
    user.setId(1L);
  }

  @Test
  void testCreateSession() {
    // Given
    when(sessionRepository.save(session)).thenReturn(session);

    // When
    Session createdSession = sessionService.create(session);

    // Then
    assertNotNull(createdSession);
    assertEquals(1L, createdSession.getId());
  }

  @Test
  void testDeleteSession() {
    // Given
    doNothing().when(sessionRepository).deleteById(1L);

    // When
    sessionService.delete(1L);

    // Then
    verify(sessionRepository, times(1)).deleteById(1L);
  }

  @Test
  void testFindAllSessions() {
    // Given
    when(sessionRepository.findAll()).thenReturn(Collections.singletonList(session));

    // When
    List<Session> result = sessionService.findAll();

    // Then
    assertEquals(1, result.size());
  }

  @Test
  void testGetSessionById() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

    // When
    Session foundSession = sessionService.getById(1L);

    // Then
    assertNotNull(foundSession);
  }

  @Test
  void testUpdateSession() {
    // Given
    when(sessionRepository.save(session)).thenReturn(session);

    // When
    Session updatedSession = sessionService.update(1L, session);

    // Then
    assertNotNull(updatedSession);
    assertEquals(1L, updatedSession.getId());
  }

  @Test
  void testParticipateSessionNotFound() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

    // When / Then
    assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
  }

  @Test
  void testParticipateUserNotFound() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
    when(userRepository.findById(1L)).thenReturn(Optional.empty());

    // When / Then
    assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
  }

  @Test
  void testParticipateAlreadyJoined() {
    // Given
    session.setUsers(Collections.singletonList(user));
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
    when(userRepository.findById(1L)).thenReturn(Optional.of(user));

    // When / Then
    assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
  }

  @Test
  void testNoLongerParticipateSuccess() {
    // Given
    session.setUsers(Collections.singletonList(user));
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

    // When
    sessionService.noLongerParticipate(1L, 1L);

    // Then
    verify(sessionRepository, times(1)).save(session);
  }

  @Test
  void testNoLongerParticipateSessionNotFound() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

    // When / Then
    assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 1L));
  }

  @Test
  void testNoLongerParticipateUserNotInSession() {
    // Given
    when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

    // When / Then
    assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));
  }
}



