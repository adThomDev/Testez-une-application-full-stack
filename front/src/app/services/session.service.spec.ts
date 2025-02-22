import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with isLogged as false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should update session information and set isLogged to true on login', () => {
    const mockUser: SessionInformation = {
      token: 'test-token',
      type: 'user',
      id: 1,
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    };

    service.logIn(mockUser);

    expect(service.sessionInformation).toEqual(mockUser);
    expect(service.isLogged).toBe(true);
  });

  it('should clear session information and set isLogged to false on logout', () => {
    service.logOut();

    expect(service.sessionInformation).toBeUndefined();
    expect(service.isLogged).toBe(false);
  });

  it('should emit correct values from $isLogged observable', (done) => {
    const values: boolean[] = [];

    service.$isLogged().subscribe((val) => {
      values.push(val);
      if (values.length === 3) {
        expect(values).toEqual([false, true, false]);
        done();
      }
    });

    service.logIn({
      token: 'test-token',
      type: 'user',
      id: 1,
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    });

    service.logOut();
  });
});

