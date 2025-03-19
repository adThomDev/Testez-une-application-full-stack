package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

  private MockMvc mockMvc;

  @Mock
  private TeacherService teacherService;

  @Mock
  private TeacherMapper teacherMapper;

  @InjectMocks
  private TeacherController teacherController;

  private final ObjectMapper objectMapper = new ObjectMapper();

  private Teacher teacher;
  private TeacherDto teacherDto;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();

    teacher = new Teacher(1L, "bob", "bobby", null, null);
    teacherDto = new TeacherDto(1L, "bob", "bobby", null, null);
  }

  @Test
  void testFindById_Success() throws Exception {
    when(teacherService.findById(1L)).thenReturn(teacher);
    when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

    mockMvc.perform(get("/api/teacher/1")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.lastName").value("bob"))
        .andExpect(jsonPath("$.firstName").value("bobby"));
  }

  @Test
  void testFindById_NotFound() throws Exception {
    when(teacherService.findById(anyLong())).thenReturn(null);

    mockMvc.perform(get("/api/teacher/99")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }

  @Test
  void testFindById_BadRequest() throws Exception {
    mockMvc.perform(get("/api/teacher/invalid")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isBadRequest());
  }

  @Test
  void testFindAll_Success() throws Exception {
    List<Teacher> teachers = Arrays.asList(teacher);
    List<TeacherDto> teacherDtos = Arrays.asList(teacherDto);

    when(teacherService.findAll()).thenReturn(teachers);
    when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

    mockMvc.perform(get("/api/teacher")
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].lastName").value("bob"))
        .andExpect(jsonPath("$[0].firstName").value("bobby"));
  }
}

