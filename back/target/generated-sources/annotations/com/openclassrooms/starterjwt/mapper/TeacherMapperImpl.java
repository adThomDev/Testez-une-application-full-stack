package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-02-15T09:36:39+0100",
    comments = "version: 1.5.1.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class TeacherMapperImpl implements TeacherMapper {

    @Override
    public Teacher toEntity(TeacherDto dto) {
        if ( dto == null ) {
            return null;
        }

        Teacher.TeacherBuilder teacher = Teacher.builder();

        teacher.id( dto.getId() );
        teacher.lastName( dto.getLastName() );
        teacher.firstName( dto.getFirstName() );
        teacher.createdAt( dto.getCreatedAt() );
        teacher.updatedAt( dto.getUpdatedAt() );

        return teacher.build();
    }

    @Override
    public TeacherDto toDto(Teacher entity) {
        if ( entity == null ) {
            return null;
        }

        TeacherDto teacherDto = new TeacherDto();

        teacherDto.setId( entity.getId() );
        teacherDto.setLastName( entity.getLastName() );
        teacherDto.setFirstName( entity.getFirstName() );
        teacherDto.setCreatedAt( entity.getCreatedAt() );
        teacherDto.setUpdatedAt( entity.getUpdatedAt() );

        return teacherDto;
    }

    @Override
    public List<Teacher> toEntity(List<TeacherDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Teacher> list = new ArrayList<Teacher>( dtoList.size() );
        for ( TeacherDto teacherDto : dtoList ) {
            list.add( toEntity( teacherDto ) );
        }

        return list;
    }

    @Override
    public List<TeacherDto> toDto(List<Teacher> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<TeacherDto> list = new ArrayList<TeacherDto>( entityList.size() );
        for ( Teacher teacher : entityList ) {
            list.add( toDto( teacher ) );
        }

        return list;
    }
}
