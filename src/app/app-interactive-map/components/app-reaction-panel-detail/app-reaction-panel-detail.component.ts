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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Store, select} from '@ngrx/store';
import { AppState } from '../../../store/app.reducers';

import {Reaction} from '../../types';
import {RemoveReaction, SelectCard} from '../../store/interactive-map.actions';

@Component({
  selector: 'app-reaction-panel-detail',
  templateUrl: './app-reaction-panel-detail.component.html',
  styleUrls: ['./app-reaction-panel-detail.component.scss'],
})
export class AppReactionPanelDetailComponent implements OnInit, OnChanges {
  @Input() public itemsSelected: Reaction[] = [];
  @Input() public type: string;
  @Output() itemRemoved: EventEmitter<Reaction> = new EventEmitter();
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  removeItem(reaction: Reaction): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
