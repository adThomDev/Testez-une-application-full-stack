package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.annotation.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-02-15T09:36:38+0100",
    comments = "version: 1.5.1.Final, compiler: javac, environment: Java 17.0.6 (Oracle Corporation)"
)
@Component
public class SessionMapperImpl extends SessionMapper {

    @Override
    public List<Session> toEntity(List<SessionDto> dtoList) {
        if ( dtoList == null ) {
            return null;
        }

        List<Session> list = new ArrayList<Session>( dtoList.size() );
        for ( SessionDto sessionDto : dtoList ) {
            list.add( toEntity( sessionDto ) );
        }

        return list;
    }

    @Override
    public List<SessionDto> toDto(List<Session> entityList) {
        if ( entityList == null ) {
            return null;
        }

        List<SessionDto> list = new ArrayList<SessionDto>( entityList.size() );
        for ( Session session : entityList ) {
            list.add( toDto( session ) );
        }

        return list;
    }

    @Override
    public Session toEntity(SessionDto sessionDto) {
        if ( sessionDto == null ) {
            return null;
        }

        Session.SessionBuilder session = Session.builder();

        session.description( sessionDto.getDescription() );
        session.id( sessionDto.getId() );
        session.name( sessionDto.getName() );
        session.date( sessionDto.getDate() );
        session.createdAt( sessionDto.getCreatedAt() );
        session.updatedAt( sessionDto.getUpdatedAt() );

        session.teacher( sessionDto.getTeacher_id() != null ? this.teacherService.findById(sessionDto.getTeacher_id()) : null );
        session.users( Optional.ofNullable(sessionDto.getUsers()).orElseGet(Collections::emptyList).stream().map(user_id -> { User user = this.userService.findById(user_id); if (user != null) { return user; } return null; }).collect(Collectors.toList()) );

        return session.build();
    }

    @Override
    public SessionDto toDto(Session session) {
        if ( session == null ) {
            return null;
        }

        SessionDto sessionDto = new SessionDto();

        sessionDto.setDescription( session.getDescription() );
        sessionDto.setTeacher_id( sessionTeacherId( session ) );
        sessionDto.setId( session.getId() );
        sessionDto.setName( session.getName() );
        sessionDto.setDate( session.getDate() );
        sessionDto.setCreatedAt( session.getCreatedAt() );
        sessionDto.setUpdatedAt( session.getUpdatedAt() );

        sessionDto.setUsers( Optional.ofNullable(session.getUsers()).orElseGet(Collections::emptyList).stream().map(u -> u.getId()).collect(Collectors.toList()) );

        return sessionDto;
    }

    private Long sessionTeacherId(Session session) {
        if ( session == null ) {
            return null;
        }
        Teacher teacher = session.getTeacher();
        if ( teacher == null ) {
            return null;
        }
        Long id = teacher.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
