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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFormDesignComponent } from './app-form-design.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppMaterialModule } from '../../../app-material.module';
import {initialState} from '../../../app-interactive-map/components/app-reaction/mock-initial-state';
import {reducers} from '../../../store/app.reducers';
import {StoreModule} from '@ngrx/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('AppFormDesignComponent', () => {
  let component: AppFormDesignComponent;
  let fixture: ComponentFixture<AppFormDesignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        AppMaterialModule,
        BrowserAnimationsModule,
        StoreModule.forRoot(reducers, {initialState}),
      ],
      declarations: [ AppFormDesignComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFormDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
