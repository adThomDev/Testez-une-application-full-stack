import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

jest.mock('../../services/auth.service');

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    authService = {
      register: jest.fn()
    } as unknown as jest.Mocked<AuthService>;
    
    router = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form initialized', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls['email']).toBeDefined();
    expect(component.form.controls['firstName']).toBeDefined();
    expect(component.form.controls['lastName']).toBeDefined();
    expect(component.form.controls['password']).toBeDefined();
  });

  it('should invalidate the form when fields are empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate form correctly', () => {
    component.form.setValue({
      email: 'test@aze.com',
      firstName: 'boby',
      lastName: 'bob',
      password: 'password'
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should call authService.register on form submission', () => {
    component.form.setValue({
      email: 'test@aze.com',
      firstName: 'boby',
      lastName: 'bob',
      password: 'password'
    });
    authService.register.mockReturnValue(of(void 0));

    component.submit();
    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@aze.com',
      firstName: 'boby',
      lastName: 'bob',
      password: 'password'
    } as RegisterRequest);
  });

  it('should navigate to /login on successful registration', () => {
    authService.register.mockReturnValue(of(void 0));
    component.submit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true on registration failure', () => {
    authService.register.mockReturnValue(throwError(() => new Error('Registration failed')));
    component.submit();
    expect(component.onError).toBeTruthy();
  });
});
