import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { expect } from '@jest/globals';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;

  const mockSession = {
    id: 1,
    name: 'Test Session',
    description: 'Test Description',
    date: new Date('2024-02-22'),
    teacher_id: 1,
    users: []
  };

  const mockTeachers = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' }
  ];

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  };

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
      url: '/sessions/create'
    } as any;

    mockSessionApiService = {
      create: jest.fn().mockReturnValue(of(mockSession)),
      update: jest.fn().mockReturnValue(of(mockSession)),
      detail: jest.fn().mockReturnValue(of(mockSession))
    } as any;

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of(mockTeachers))
    } as any;

    mockMatSnackBar = {
      open: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ],
      declarations: [FormComponent]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect to sessions if user is not admin', () => {
    const nonAdminSessionService = {
      sessionInformation: {
        admin: false
      }
    };
    TestBed.overrideProvider(SessionService, { useValue: nonAdminSessionService });
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should initialize form correctly for create mode', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm?.get('name')?.value).toBe('');
    expect(component.sessionForm?.get('description')?.value).toBe('');
    expect(component.sessionForm?.get('teacher_id')?.value).toBe('');
  });

  it('should initialize form correctly for update mode', fakeAsync(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    Object.defineProperty(mockRouter, 'url', {
      get: () => '/sessions/update/1'
    });
    component.ngOnInit();
    tick();

    expect(component.onUpdate).toBeTruthy();
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.get('name')?.value).toBe(mockSession.name);
    expect(component.sessionForm?.get('description')?.value).toBe(mockSession.description);
    expect(component.sessionForm?.get('teacher_id')?.value).toBe(mockSession.teacher_id);
  }));

  it('should create session when submit is called in create mode', fakeAsync(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sessionForm?.patchValue({
      name: 'New Session',
      description: 'New Description',
      date: '2024-02-22',
      teacher_id: 1
    });

    component.submit();
    tick();

    expect(mockSessionApiService.create).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should update session when submit is called in update mode', fakeAsync(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.onUpdate = true;
    component.sessionForm?.patchValue({
      name: 'Updated Session',
      description: 'Updated Description',
      date: '2024-02-22',
      teacher_id: 1
    });

    component.submit();
    tick();

    expect(mockSessionApiService.update).toHaveBeenCalled();
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  }));

  it('should load teachers on init', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(mockTeacherService.all).toHaveBeenCalled();
  });

  it('should have invalid form when required fields are empty', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.sessionForm?.valid).toBeFalsy();
  });

  it('should have valid form when all required fields are filled', () => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.sessionForm?.patchValue({
      name: 'Test Session',
      description: 'Test Description',
      date: '2024-02-22',
      teacher_id: 1
    });

    expect(component.sessionForm?.valid).toBeTruthy();
  });
});