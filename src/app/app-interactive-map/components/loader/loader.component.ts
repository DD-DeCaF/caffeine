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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {select, Store} from '@ngrx/store';

import {AppState} from '../../../store/app.reducers';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {

  private loadingSubscription: Subscription;

  constructor (
    public dialogRef: MatDialogRef<LoaderComponent>,
    public store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this.loadingSubscription = this.store.pipe(select((store) => store.loader.loading)).subscribe((loading) => {
      if (!loading) {
        setTimeout(() => {
          this.dialogRef.close();
        }, 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}

