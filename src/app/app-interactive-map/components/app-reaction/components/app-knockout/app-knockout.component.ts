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

import {Component, AfterViewInit, ViewChild, Input} from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AppPanelComponent } from '../app-panel/app-panel.component';
import { HydratedCard, OperationDirection, Cobra } from '../../../../types';
import { AppDetailComponent } from '../app-detail/app-detail.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../store/app.reducers';
import { ReactionOperation } from '../../../../store/interactive-map.actions';

@Component({
  selector: 'app-knockout',
  templateUrl: './app-knockout.component.html',
})
export class AppKnockoutComponent implements AfterViewInit {
  @ViewChild('panel') panel: AppPanelComponent;
  @ViewChild('detail') detail: AppDetailComponent;

  @Input() card: HydratedCard;

  public reactions$: Observable<string[]>;
  public reactionsSubject = new Subject<string[]>();

  constructor(
    public store: Store<AppState>,
  ) {
    this.reactions$ = this.reactionsSubject.asObservable();
  }

  ngAfterViewInit(): void {
    this.panel.query
      .subscribe((query: string) => {
        const queryString = query.toLocaleLowerCase();
        const results = this.card.model.reactions
          .filter((reaction: Cobra.Reaction) =>
            reaction.id.toLowerCase().includes(queryString))
          .map((reaction) => reaction.id);
        this.reactionsSubject.next(results);
      });

    this.panel.select
    .subscribe((reaction: string) => {
      this.store.dispatch(new ReactionOperation({
        item: reaction,
        operationTarget: 'knockoutReactions',
        direction: OperationDirection.Do,
      }));
    });

    this.detail.remove.subscribe((item: string) => {
      this.store.dispatch(new ReactionOperation({
        item: item,
        operationTarget: 'knockoutReactions',
        direction: OperationDirection.Undo,
      }));
    });
  }
}
