import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';
import { expect } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = 'api/user';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user by ID', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@aze.com',
      lastName: 'boby',
      firstName: 'bob',
      admin: false,
      password: 'password',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-02-01'),
    };

    service.getById('1').subscribe((user) => {
      expect(user).toEqual(mockUser);
      expect(user.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should delete user by ID', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});

