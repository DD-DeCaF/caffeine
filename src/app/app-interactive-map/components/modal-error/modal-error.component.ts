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

import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-loader',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ModalErrorComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog) {}
  reload(): void {
    location.reload();
  }

  goHome(): void {
    this.dialog.closeAll();
    this.router.navigateByUrl('/');
  }
}

