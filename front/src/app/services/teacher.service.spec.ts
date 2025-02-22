import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;
  const apiUrl = 'api/teacher';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        lastName: 'bob',
        firstName: 'bobby',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-02-01'),
      },
      {
        id: 2,
        lastName: 'nom2',
        firstName: 'prenom2',
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-04-01'),
      },
    ];

    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
      expect(teachers.length).toBe(2);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should fetch teacher details by ID', () => {
    const mockTeacher: Teacher = {
      id: 1,
      lastName: 'bob',
      firstName: 'bobby',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-02-01'),
    };

    service.detail('1').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
      expect(teacher.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});

