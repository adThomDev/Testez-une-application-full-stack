import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { MeComponent } from './me.component';
import { expect } from '@jest/globals';
import {User} from "../../interfaces/user.interface";

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockUser: User = {
    id: 1,
    firstName: 'boby',
    lastName: 'BOB',
    email: 'bob@truc.com',
    admin: false,
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1
    },
    logOut: jest.fn()
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of(void 0))
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const mockMatSnackBar = {
    open: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user data on init', () => {
      fixture.detectChanges();
      
      expect(userService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(mockUser);
    });
  });

  describe('back', () => {
    it('should navigate back in history', () => {
      const mockHistoryBack = jest.spyOn(window.history, 'back');
      
      component.back();
      
      expect(mockHistoryBack).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user account and handle successful deletion', fakeAsync(() => {
      component.delete();
      tick();

      expect(userService.delete).toHaveBeenCalledWith('1');
      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(sessionService.logOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    }));
  });

  describe('template tests', () => {
    beforeEach(() => {
      component.user = mockUser;
      fixture.detectChanges();
    });

    it('should display user information when user data is available', () => {
      const compiled = fixture.debugElement.nativeElement;
      
      expect(compiled.querySelector('p').textContent)
        .toContain(`Name: ${mockUser.firstName} ${mockUser.lastName}`);
      expect(compiled.querySelectorAll('p')[1].textContent)
        .toContain(`Email: ${mockUser.email}`);
    });

    it('should show delete button for non-admin users', () => {
      const compiled = fixture.debugElement.nativeElement;
      const deleteButton = compiled.querySelector('button[color="warn"]');
      
      expect(deleteButton).toBeTruthy();
    });

    it('should not show delete button for admin users', () => {
      component.user = { ...mockUser, admin: true };
      fixture.detectChanges();
      
      const compiled = fixture.debugElement.nativeElement;
      const deleteButton = compiled.querySelector('button[color="warn"]');
      
      expect(deleteButton).toBeFalsy();
    });

    it('should show admin message for admin users', () => {
      component.user = { ...mockUser, admin: true };
      fixture.detectChanges();
      
      const compiled = fixture.debugElement.nativeElement;
      const adminMessage = compiled.querySelector('.my2');
      
      expect(adminMessage.textContent).toContain('You are admin');
    });
  });
});