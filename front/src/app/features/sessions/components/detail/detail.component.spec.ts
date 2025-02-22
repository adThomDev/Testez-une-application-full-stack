import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { DetailComponent } from './detail.component';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { Session } from '../../interfaces/session.interface';
import { Teacher } from '../../../../interfaces/teacher.interface';
import { expect } from '@jest/globals';
import { FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

jest.mock('../../services/session-api.service');
jest.mock('../../../../services/teacher.service');

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let teacherService: jest.Mocked<TeacherService>;
  let snackBar: jest.Mocked<MatSnackBar>;
  let router: jest.Mocked<Router>;

  const mockSession: Session = {
    id: 1,
    name: 'yoga Session',
    description: 'a yoga session',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2, 3],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockTeacher: Teacher = {
    id: 1,
    firstName: 'boby',
    lastName: 'bob',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    sessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of(void 0)),
      participate: jest.fn().mockReturnValue(of(void 0)),
      unParticipate: jest.fn().mockReturnValue(of(void 0))
    } as unknown as jest.Mocked<SessionApiService>;

    teacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    } as unknown as jest.Mocked<TeacherService>;

    snackBar = {
      open: jest.fn()
    } as unknown as jest.Mocked<MatSnackBar>;

    router = {
      navigate: jest.fn()
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatCardModule 
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: TeacherService, useValue: teacherService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        {
          provide: SessionService,
          useValue: { sessionInformation: { id: 1, admin: true } }
        },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session on init', () => {
    expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    expect(teacherService.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
  });

  it('should navigate back on back()', () => {
    jest.spyOn(window.history, 'back');
    component.back();
    expect(window.history.back).toHaveBeenCalled();
  });

  it('should delete session and navigate on delete()', () => {
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should participate in session', () => {
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
  });

  it('should unParticipate from session', () => {
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
  });
});
