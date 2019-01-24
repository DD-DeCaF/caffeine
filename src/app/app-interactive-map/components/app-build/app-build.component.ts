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

import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {MatButton, MatDialog, MatSelect} from '@angular/material';
import {Store, select} from '@ngrx/store';
import {Observable, fromEvent} from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import {SelectCard, NextCard, PreviousCard, SetPlayState, AddCard, DeleteCard, SaveDesign, SetOperations} from '../../store/interactive-map.actions';
import * as fromInteractiveMapSelectors from '../../store/interactive-map.selectors';

import {AppState} from '../../../store/app.reducers';
import {CardType, Condition, DeCaF, Experiment, HydratedCard, Method} from '../../types';
import {selectNotNull} from '../../../framework-extensions';
import {getSelectedCard} from '../../store/interactive-map.selectors';
import {SelectProjectComponent} from './components/select-project/select-project.component';
import {ShowHelpComponent} from './components/show-help/show-help.component';
import {environment} from '../../../../environments/environment';
import * as actions from '../../../store/shared.actions';
import Operation = DeCaF.Operation;

@Component({
  selector: 'app-build',
  templateUrl: './app-build.component.html',
  styleUrls: ['./app-build.component.scss'],
})
export class AppBuildComponent implements OnInit, AfterViewInit {
  @ViewChild('play') playButton: MatButton;

  interactiveMapState: Observable<AppState>;
  public cards: Observable<HydratedCard[]>;
  public playing: Observable<boolean>;
  public selectedProjectId: number;
  public expandedCard: HydratedCard = null;
  public selectedCard: HydratedCard = null;
  public tabIndex: number = null;
  public experiments: Observable<Experiment[]>;
  public conditions: Condition[];

  public methods: Method[] = [
    {id: 'fba', name: 'Flux Balance Analysis (FBA)'},
    {id: 'pfba', name: 'Parsimonious FBA'},
    {id: 'fva', name: 'Flux Variability Analysis (FVA)'},
    {id: 'pfba-fva', name: 'Parsimonious FVA'},
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.cards = this.store.pipe(select(fromInteractiveMapSelectors.getHydratedCards));
    this.playing = this.store.pipe(select((state: AppState) => state.interactiveMap.playing));
    this.experiments = this.store.pipe(select((store) => store.shared.experiments));

    this.store.pipe(
      selectNotNull((store) => store.shared.selectedProject)).subscribe((project) => {
      this.selectedProjectId = project.id;
    });

    this.store.pipe(
      selectNotNull(getSelectedCard)).subscribe((card) => {
      this.selectedCard = card;
      if (this.expandedCard) {
        this.expandedCard = card;
      }
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.playButton._elementRef.nativeElement, 'click').pipe(
      withLatestFrom(this.playing),
    ).subscribe(([, playing]) => {
      this.store.dispatch(new SetPlayState(!playing));
    });
  }

  public select(card: HydratedCard): void {
    this.store.dispatch(new SelectCard(card.id));
  }

  public addDesignCard(): void {
    this.store.dispatch(new AddCard(CardType.Design));
  }

  public addDataDrivenCard(): void {
    this.store.dispatch(new AddCard(CardType.DataDriven));
  }

  public next(): void {
    this.store.dispatch(new NextCard());
  }

  public previous(): void {
    this.store.dispatch(new PreviousCard());
  }

  public delete(card: HydratedCard): void {
    this.store.dispatch(new DeleteCard(card.id));
  }

  public grow(card: HydratedCard, tabIndex: number): void {
    this.store.dispatch(new SetPlayState(false));
    this.store.dispatch(new SelectCard(card.id));
    this.expandedCard = card;
    this.tabIndex = tabIndex;
  }

  public shrink(): void {
    this.expandedCard = null;
  }

  private growthRateMeaningful(growthRate: number): boolean {
    return Math.abs(growthRate) > 1e-05;
  }

  public growthRateBackground(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ? 'white' : '#FEEFB3';
  }

  public formatGrowthRate(growthRate: number): string {
    return this.growthRateMeaningful(growthRate) ?
      growthRate.toPrecision(3) :
      '0';
  }

  public save(card: HydratedCard, projectId: number): void {
    if (card.projectId) {
      this.store.dispatch(new SaveDesign(card, card.projectId));
    } else {
      if (projectId) {
        this.store.dispatch(new SaveDesign(card, projectId));
      } else {
        const dialogRef = this.dialog.open(SelectProjectComponent);
        dialogRef.afterClosed().subscribe(
          (id) => {
            if (id) {
              this.store.dispatch(new SaveDesign(card, id));
            }
          });
      }
    }
  }

  public experimentChanged(event: MatSelect): void {
    this.http.get(`${environment.apis.warehouse}/experiments/${event.value}/conditions`).subscribe((conditions: Condition[]) => {
      this.conditions = conditions;
      console.log('conditions', conditions);
    });
  }

  public conditionChanged(event: MatSelect): void {
    this.http.get(`${environment.apis.warehouse}/conditions/${event.value}/data`).subscribe((condition) => {
      console.log('CONDITIONS', condition);
      this.http.post(`${environment.apis.model}/models/${this.selectedCard.model_id}/modify`, condition).subscribe((operations: Operation[]) => {
        console.log('operations', operations);
        this.store.dispatch(new SetOperations(operations));
      });
    });
  }

  public showHelp(event: Event): void {
    event.stopPropagation();
    this.dialog.open(ShowHelpComponent);
  }
}
