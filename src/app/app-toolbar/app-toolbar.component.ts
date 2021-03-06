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

import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {SessionService} from '../session/session.service';
import {SessionState} from '../session/store/session.reducers';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent implements OnInit {
  public sessionState: Observable<SessionState>;
  @Input() public sidenav: MatSidenav;

  constructor(
    private store: Store<AppState>,
    private sessionService: SessionService) {}

  public ngOnInit(): void {
    this.sessionState = this.store.select('session');
  }

  public logout(): void {
    this.sessionService.logout();
  }
}
