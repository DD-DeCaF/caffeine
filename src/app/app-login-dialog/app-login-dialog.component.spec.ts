// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {AppLoginDialogComponent} from './app-login-dialog.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppMaterialModule} from '../app-material.module';
import {reducers} from '../store/app.reducers';
import {StoreModule} from '@ngrx/store';
import {SessionService} from '../session/session.service';
import {MatDialogRef} from '@angular/material';
import {ActivatedRoute, Params} from '@angular/router';

describe('Component: Login', () => {
  let component: AppLoginDialogComponent;
  let fixture: ComponentFixture<AppLoginDialogComponent>;

  const returnValues = {
    authReturn: new Promise((resolve) => resolve()),
  };

  const mockDialogRef = {
    close: null,
  };

  const mockSessionService = {
    authenticate: null,
  };

  beforeEach(async(() => {
    mockDialogRef.close = jasmine.createSpy('close'),
    mockSessionService.authenticate = jasmine.createSpy('authenticate')
      .and.callFake(() => (returnValues.authReturn)),

    TestBed.configureTestingModule({
      imports: [
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule.forRoot(reducers),
      ],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: {
              subscribe: (fn: (value: Params) => void) => fn({
                param: 0,
              }),
            },
          },
        },
      ],
      declarations: [AppLoginDialogComponent],

    });
    fixture = TestBed.createComponent(AppLoginDialogComponent);
    component = fixture.componentInstance;
  }));

  it('should have an invalid form it\'s empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have required error on email field', () => {
    const email = component.loginForm.controls.email;
    const errors = email.errors || {};
    expect(errors.required).toBeTruthy();
  });

  it('should have a valid form if fileld out', () => {
    component.loginForm.controls.email.setValue('test@test.com');
    component.loginForm.controls.password.setValue('pass4test');
    expect(component.loginForm.valid).toBeTruthy();
    component.submit();
  });

  it('should close the dialog on successful authentication', async(async () => {
    returnValues.authReturn = new Promise((resolve, reject) => resolve());
    component.loginForm.controls.email.setValue('test@test.com');
    component.loginForm.controls.password.setValue('pass4test');
    await component.submit();
    fixture.whenStable().then(() => {
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  }));

  it('should fetch the error message on unsuccesful authentication', async(async () => {
    returnValues.authReturn = new Promise((resolve, reject) => reject({
      error: {
        message: 'Authentication was not succesful',
      },
    }));
    component.loginForm.controls.email.setValue('test@test.com');
    component.loginForm.controls.password.setValue('pass4test');
    await component.submit();
    fixture.whenStable().then(() => {
      expect(mockDialogRef.close).not.toHaveBeenCalled();
      expect(component.uiStatus).toBe('error');
    });
  }));
});
