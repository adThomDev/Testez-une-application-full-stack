import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { expect } from '@jest/globals';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'api/session';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    const mockSessions: Session[] = [
      { id: 1, name: 'Math Class', description: 'Algebra basics', date: new Date(), teacher_id: 2, users: [1, 2] },
      { id: 2, name: 'Science Lab', description: 'Chemistry experiments', date: new Date(), teacher_id: 3, users: [3, 4] },
    ];

    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
      expect(sessions.length).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should fetch session details by ID', () => {
    const mockSession: Session = {
      id: 1,
      name: 'Math Class',
      description: 'Algebra basics',
      date: new Date(),
      teacher_id: 2,
      users: [1, 2],
    };

    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session by ID', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a session', () => {
    const newSession: Session = {
      name: 'Physics Lecture',
      description: 'Newton’s Laws',
      date: new Date(),
      teacher_id: 4,
      users: [5, 6],
    };

    service.create(newSession).subscribe((session) => {
      expect(session).toEqual({ ...newSession, id: 3 });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newSession, id: 3 });
  });

  it('should update a session', () => {
    const updatedSession: Session = {
      id: 1,
      name: 'Updated Math Class',
      description: 'Advanced Algebra',
      date: new Date(),
      teacher_id: 2,
      users: [1, 2],
    };

    service.update('1', updatedSession).subscribe((session) => {
      expect(session).toEqual(updatedSession);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedSession);
  });

  it('should participate a user in a session', () => {
    service.participate('1', '10').subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/participate/10`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should unparticipate a user from a session', () => {
    service.unParticipate('1', '10').subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/participate/10`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

