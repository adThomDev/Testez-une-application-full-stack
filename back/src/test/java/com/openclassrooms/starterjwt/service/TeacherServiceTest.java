package com.openclassrooms.starterjwt.service;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

  @Mock
  private TeacherRepository teacherRepository;

  @InjectMocks
  private TeacherService teacherService;

  private Teacher teacher1;
  private Teacher teacher2;

  @BeforeEach
  void setUp() {
    teacher1 = Teacher.builder()
        .id(1L)
        .lastName("nom1")
        .firstName("prenom1")
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();

    teacher2 = Teacher.builder()
        .id(2L)
        .lastName("nom2")
        .firstName("prenom2")
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .build();
  }

  @Test
  void testFindAll_ReturnsListOfTeachers() {
    // Given
    List<Teacher> expectedTeachers = Arrays.asList(teacher1, teacher2);
    when(teacherRepository.findAll()).thenReturn(expectedTeachers);

    // When
    List<Teacher> result = teacherService.findAll();

    // Then
    assertNotNull(result);
    assertEquals(2, result.size());
    assertEquals("nom1", result.get(0).getLastName());
    assertEquals("nom2", result.get(1).getLastName());
    verify(teacherRepository, times(1)).findAll();
  }

  @Test
  void testFindById_TeacherExists() {
    // Given
    when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher1));

    // When
    Teacher result = teacherService.findById(1L);

    // Then
    assertNotNull(result);
    assertEquals(1L, result.getId());
    assertEquals("prenom1", result.getFirstName());
    assertEquals("nom1", result.getLastName());
    verify(teacherRepository, times(1)).findById(1L);
  }

  @Test
  void testFindById_TeacherNotFound() {
    // Given
    when(teacherRepository.findById(3L)).thenReturn(Optional.empty());

    // When
    Teacher result = teacherService.findById(3L);

    // Then
    assertNull(result);
    verify(teacherRepository, times(1)).findById(3L);
  }
}
