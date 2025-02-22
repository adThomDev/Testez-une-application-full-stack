import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let sessionService: jest.Mocked<SessionService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    authService = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>;

    sessionService = {
      logIn: jest.fn()
    } as unknown as jest.Mocked<SessionService>;

    router = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password controls', () => {
    expect(component.form.contains('email')).toBe(true);
    expect(component.form.contains('password')).toBe(true);
  });

  it('should require email and password', () => {
    component.form.setValue({ email: '', password: '' });
    expect(component.form.valid).toBeFalsy();
  });

  it('should call authService.login and navigate on successful login', () => {
    const sessionInfo: SessionInformation = {
      token: 'test-token',
      type: 'Bearer',
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      admin: false,
    };
    authService.login.mockReturnValue(of(sessionInfo));

    component.form.setValue({ email: 'test@example.com', password: 'password' });
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(sessionService.logIn).toHaveBeenCalledWith(sessionInfo);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true if login fails', () => {
    authService.login.mockReturnValue(throwError(() => new Error('Login failed')));

    component.form.setValue({ email: 'test@example.com', password: 'password' });
    component.submit();

    expect(component.onError).toBe(true);
  });
});
