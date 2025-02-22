import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { expect, jest } from '@jest/globals';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
    } as unknown as jest.Mocked<HttpClient>;

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: mockHttpClient }],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.post on register', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@aze.com',
      firstName: 'bilbo',
      lastName: 'bob',
      password: 'password',
    };

    mockHttpClient.post.mockReturnValue(of(void 0));

    service.register(registerRequest).subscribe();

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'api/auth/register',
      registerRequest
    );
  });

  it('should call HttpClient.post on login and return session information', () => {
    const loginRequest: LoginRequest = {
      email: 'test@aze.com',
      password: 'password',
    };

    const sessionInfo: SessionInformation = {
      token: 'azert45',
      type: 'Bearer',
      id: 1,
      username: 'bilbobob',
      firstName: 'bilbo',
      lastName: 'bob',
      admin: true,
    };

    mockHttpClient.post.mockReturnValue(of(sessionInfo));

    service.login(loginRequest).subscribe((result) => {
      expect(result).toEqual(sessionInfo);
    });

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'api/auth/login',
      loginRequest
    );
  });
});
